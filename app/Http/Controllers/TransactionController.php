<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Http\Requests\Transactions\UpdateTransactionRequest;
use App\Models\Category;
use App\Models\File;
use App\Models\Transaction;
use App\Services\BudgetAlertService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
                'income' => (float) $rows->where('type', Type::Income->value)->sum('total'),
                'expense' => (float) $rows->where('type', Type::Expense->value)->sum('total'),
                'net' => (float) $rows->where('type', Type::Income->value)->sum('total')
                    - (float) $rows->where('type', Type::Expense->value)->sum('total'),
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
            if ($handle === false) {
                return;
            }
            fputcsv($handle, ['Date', 'Description', 'Type', 'Amount', 'Category', 'Wallet', 'Notes']);

            foreach ($query->cursor() as $transaction) {
                fputcsv($handle, [
                    $transaction->transacted_at,
                    $transaction->description,
                    $transaction->type->value,
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
     * @return Builder<Transaction>
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
    public function store(StoreTransactionRequest $request, BudgetAlertService $alerts): RedirectResponse
    {
        $transaction = $request->user()->transactions()->create($request->safe()->except('file_ids'));

        $fileIds = $request->safe()->input('file_ids', []);
        if (! empty($fileIds)) {
            File::query()
                ->where('user_id', $request->user()->id)
                ->whereIn('id', $fileIds)
                ->whereNull('fileable_type')
                ->update([
                    'fileable_type' => Transaction::class,
                    'fileable_id' => $transaction->id,
                ]);
        }

        $transaction->load('wallet');
        $alerts->checkAfterTransaction($transaction, $request->user());

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

        $transaction->load(['wallet', 'category', 'files']);

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

        $transaction->load('files');
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
    public function update(UpdateTransactionRequest $request, Transaction $transaction, BudgetAlertService $alerts): RedirectResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $transaction->update($request->validated());

        $transaction->load('wallet');
        $alerts->checkAfterTransaction($transaction, $request->user());

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

    /**
     * Bulk delete transactions belonging to the authenticated user.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid'],
        ]);

        $deleted = Transaction::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('id', $validated['ids'])
            ->delete();

        return redirect()
            ->back()
            ->with('success', $deleted.' transactions deleted.');
    }

    /**
     * Show CSV import form.
     */
    public function importForm(Request $request): Response
    {
        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        return inertia('transactions/import', [
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    /**
     * Import transactions from a CSV file.
     */
    public function import(Request $request, BudgetAlertService $alerts): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
            'wallet_id' => [
                'required',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $request->user()->id),
            ],
            'col_date' => ['required', 'string'],
            'col_description' => ['required', 'string'],
            'col_amount' => ['required', 'string'],
            'col_type' => ['nullable', 'string'],
            'col_category' => ['nullable', 'string'],
            'default_type' => ['nullable', 'string', Rule::in(['income', 'expense'])],
            'default_category_id' => [
                'nullable',
                'uuid',
                Rule::exists('categories', 'id')->where('user_id', $request->user()->id),
            ],
            'skip_header' => ['boolean'],
        ]);

        $wallet = $request->user()->wallets()->where('id', $validated['wallet_id'])->firstOrFail();
        $handle = fopen($request->file('file')->getPathname(), 'r');
        if ($handle === false) {
            return redirect()->route('transactions.index')->withErrors(['file' => 'Could not open the uploaded file.']);
        }
        $firstRow = true;
        $imported = 0;
        $skipped = 0;
        $importedTransactions = [];

        $categories = $request->user()->categories()->get()->keyBy(fn ($c) => strtolower($c->name));

        while (($row = fgetcsv($handle)) !== false) {
            if ($firstRow && $validated['skip_header']) {
                $headers = array_map(fn (?string $v) => trim($v ?? ''), $row);
                $firstRow = false;

                continue;
            }
            $firstRow = false;

            if (isset($headers)) {
                $row = array_combine($headers, array_pad($row, count($headers), ''));
                $dateVal = trim($row[$validated['col_date']] ?? '');
                $descVal = trim($row[$validated['col_description']] ?? '');
                $amountVal = trim($row[$validated['col_amount']] ?? '');
                $typeVal = $validated['col_type'] ? trim($row[$validated['col_type']] ?? '') : null;
                $catVal = $validated['col_category'] ? trim($row[$validated['col_category']] ?? '') : null;
            } else {
                $cols = $row;
                $dateVal = trim($cols[(int) $validated['col_date']] ?? '');
                $descVal = trim($cols[(int) $validated['col_description']] ?? '');
                $amountVal = trim($cols[(int) $validated['col_amount']] ?? '');
                $typeVal = $validated['col_type'] !== null ? trim($cols[(int) $validated['col_type']] ?? '') : null;
                $catVal = $validated['col_category'] !== null ? trim($cols[(int) $validated['col_category']] ?? '') : null;
            }

            try {
                $date = Carbon::parse($dateVal);
                $amount = abs((float) str_replace([',', '$', '€', '£', '৳'], '', $amountVal));
            } catch (\Exception) {
                $skipped++;

                continue;
            }

            if ($amount <= 0 || $descVal === '') {
                $skipped++;

                continue;
            }

            $type = $typeVal
                ? (str_contains(strtolower($typeVal), 'income') ? 'income' : 'expense')
                : ($validated['default_type'] ?? 'expense');

            $categoryId = $validated['default_category_id'];
            if ($catVal) {
                $matched = $categories->get(strtolower($catVal));
                if ($matched) {
                    $categoryId = $matched->id;
                }
            }

            $transaction = $request->user()->transactions()->create([
                'wallet_id' => $wallet->id,
                'category_id' => $categoryId,
                'type' => $type,
                'amount' => $amount,
                'description' => mb_substr($descVal, 0, 255),
                'transacted_at' => $date->toDateTimeString(),
                'notes' => null,
            ]);

            $transaction->setRelation('wallet', $wallet);
            $importedTransactions[] = $transaction;
            $imported++;
        }

        fclose($handle);

        $importUser = $request->user();
        foreach ($importedTransactions as $transaction) {
            $alerts->checkAfterTransaction($transaction, $importUser);
        }

        return redirect()
            ->route('transactions.index')
            ->with('success', "{$imported} transactions imported, {$skipped} skipped.");
    }

    /**
     * Bulk reassign category for transactions belonging to the authenticated user.
     */
    public function bulkReassign(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid'],
            'category_id' => [
                'required',
                'uuid',
                Rule::exists('categories', 'id')->where('user_id', $request->user()->id),
            ],
        ]);

        $updated = Transaction::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('id', $validated['ids'])
            ->update(['category_id' => $validated['category_id']]);

        return redirect()
            ->back()
            ->with('success', $updated.' transactions updated.');
    }
}
