<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Http\Requests\Transactions\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'type' => ['nullable', 'string', Rule::in(['income', 'expense', 'all'])],
            'search' => ['nullable', 'string', 'max:100'],
            'wallet_id' => ['nullable', 'uuid', 'exists:wallets,id'],
            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $type = $validated['type'] ?? 'all';

        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        $baseQuery = $this->buildQuery($request, $validated);

        $transactionsQuery = $type !== 'all'
            ? (clone $baseQuery)->where('type', $type)
            : clone $baseQuery;

        $transactions = Inertia::scroll(
            $transactionsQuery
                ->orderByDesc('transacted_at')
                ->orderByDesc('created_at')
                ->paginate(20)
        );

        $stats = (clone $baseQuery)
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->selectRaw('wallets.currency, transactions.type, SUM(transactions.amount) as total')
            ->groupBy('wallets.currency', 'transactions.type')
            ->get()
            ->groupBy('currency')
            ->map(fn ($rows, $currency) => [
                'currency' => $currency,
                'income' => (float) ($rows->firstWhere('type', Type::Income->value)?->total ?? 0),
                'expense' => (float) ($rows->firstWhere('type', Type::Expense->value)?->total ?? 0),
                'net' => (float) ($rows->firstWhere('type', Type::Income->value)?->total ?? 0)
                    - (float) ($rows->firstWhere('type', Type::Expense->value)?->total ?? 0),
            ])
            ->values();

        return inertia('transactions/index', [
            'transactions' => $transactions,
            'wallets' => $wallets,
            'categories' => $categories,
            'filters' => [
                'type' => $type,
                'search' => $validated['search'] ?? null,
                'wallet_id' => $validated['wallet_id'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'date_from' => $validated['date_from'] ?? null,
                'date_to' => $validated['date_to'] ?? null,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Export filtered transactions as CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'type' => ['nullable', 'string', Rule::in(['income', 'expense', 'all'])],
            'search' => ['nullable', 'string', 'max:100'],
            'wallet_id' => ['nullable', 'uuid', 'exists:wallets,id'],
            'category_id' => ['nullable', 'uuid', 'exists:categories,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $type = $validated['type'] ?? 'all';

        $query = $this->buildQuery($request, $validated);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $query->orderByDesc('transacted_at')->orderByDesc('created_at');

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date', 'Description', 'Type', 'Amount', 'Category', 'Wallet', 'Notes']);

            foreach ($query->cursor() as $transaction) {
                fputcsv($handle, [
                    $transaction->transacted_at,
                    $transaction->description,
                    $transaction->type instanceof Type ? $transaction->type->value : $transaction->type,
                    $transaction->amount,
                    $transaction->category?->name,
                    $transaction->wallet?->name,
                    $transaction->notes,
                ]);
            }

            fclose($handle);
        }, 'transactions.csv', ['Content-Type' => 'text/csv']);
    }

    /**
     * Build the base transaction query with filters applied.
     *
     * @param  array<string, mixed>  $validated
     */
    private function buildQuery(Request $request, array $validated): Builder
    {
        $query = Transaction::query()
            ->where('transactions.user_id', $request->user()->id)
            ->with(['wallet', 'category']);

        if (! empty($validated['search'])) {
            $query->where('description', 'like', '%'.$validated['search'].'%');
        }

        if (! empty($validated['wallet_id'])) {
            $query->where('wallet_id', $validated['wallet_id']);
        }

        if (! empty($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        if (! empty($validated['date_from'])) {
            $query->whereDate('transacted_at', '>=', $validated['date_from']);
        }

        if (! empty($validated['date_to'])) {
            $query->whereDate('transacted_at', '<=', $validated['date_to']);
        }

        return $query;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        return inertia('transactions/create', [
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $transaction = $request->user()->transactions()->create($request->validated());

        return redirect()
            ->route('transactions.show', $transaction)
            ->with('success', 'Transaction created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Transaction $transaction): Response
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $transaction->load(['wallet', 'category']);

        return inertia('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Transaction $transaction): Response
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        return inertia('transactions/edit', [
            'transaction' => $transaction,
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $transaction->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Transaction updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $transaction->delete();

        return redirect()
            ->route('transactions.index')
            ->with('success', 'Transaction deleted.');
    }
}
