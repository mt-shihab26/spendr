<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Wallets\StoreWalletRequest;
use App\Http\Requests\Wallets\UpdateWalletRequest;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $wallets = $request->user()
            ->wallets()
            ->withStats()
            ->withCount('transactions')
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get()
            ->each(function (Wallet $wallet) {
                $wallet->setAttribute('net', $wallet->netFlow());
                $wallet->setAttribute('balance', $wallet->currentBalance());
            });

        $stats = $wallets
            ->groupBy(fn (Wallet $wallet) => $wallet->currency->value)
            ->map(fn ($group, string $currency) => [
                'currency' => $currency,
                'initial_balance' => round((float) $group->sum('initial_balance'), 2),
                'income' => round((float) $group->sum('income'), 2),
                'expense' => round((float) $group->sum('expense'), 2),
                'transfers_out' => round((float) $group->sum('transfers_out'), 2),
                'transfers_in' => round((float) $group->sum('transfers_in'), 2),
                'net' => round((float) $group->sum('net'), 2),
                'balance' => round((float) $group->sum('balance'), 2),
            ])
            ->values();

        return inertia('wallets/index', [
            'wallets' => $wallets,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return inertia('wallets/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWalletRequest $request): RedirectResponse
    {
        $wallet = DB::transaction(function () use ($request) {
            if ($request->boolean('is_default')) {
                $request->user()->wallets()->update(['is_default' => false]);
            }

            return $request->user()->wallets()->create($request->validated());
        });

        return redirect()
            ->route('wallets.show', $wallet)
            ->with('success', 'Wallet created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Wallet $wallet): Response
    {
        abort_if($wallet->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'type' => ['nullable', 'string', Rule::in(['income', 'expense', 'all'])],
        ]);

        $month = $validated['month'] ?? now()->format('Y-m');
        $type = $validated['type'] ?? 'all';

        $wallet->loadStats();

        [$year, $monthNum] = explode('-', $month);

        $monthIncome = $wallet->transactions()
            ->where('type', Type::Income->value)
            ->whereYear('transacted_at', (int) $year)
            ->whereMonth('transacted_at', (int) $monthNum)
            ->sum('amount');

        $monthExpense = $wallet->transactions()
            ->where('type', Type::Expense->value)
            ->whereYear('transacted_at', (int) $year)
            ->whereMonth('transacted_at', (int) $monthNum)
            ->sum('amount');

        $wallet->setAttribute('month_income', (float) $monthIncome);
        $wallet->setAttribute('month_expense', (float) $monthExpense);

        $txQuery = $wallet->transactions()
            ->with(['wallet', 'category'])
            ->whereYear('transacted_at', (int) $year)
            ->whereMonth('transacted_at', (int) $monthNum)
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at');

        if ($type !== 'all') {
            $txQuery->where('type', $type);
        }

        $transactions = Inertia::scroll($txQuery->paginate(20));

        return inertia('wallets/show', [
            'wallet' => $wallet,
            'transactions' => $transactions,
            'month' => $month,
            'type' => $type,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Wallet $wallet): Response
    {
        abort_if($wallet->user_id !== $request->user()->id, 403);

        $wallet->loadCount('transactions');

        return inertia('wallets/edit', [
            'wallet' => $wallet,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalletRequest $request, Wallet $wallet): RedirectResponse
    {
        abort_if($wallet->user_id !== $request->user()->id, 403);

        DB::transaction(function () use ($request, $wallet) {
            if ($request->boolean('is_default')) {
                $request->user()->wallets()->where('id', '!=', $wallet->id)->update(['is_default' => false]);
            }

            $wallet->update($request->validated());
        });

        return redirect()
            ->back()
            ->with('success', 'Wallet updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Wallet $wallet): RedirectResponse
    {
        abort_if($wallet->user_id !== $request->user()->id, 403);

        DB::transaction(function () use ($request, $wallet) {
            $wasDefault = $wallet->is_default;

            $wallet->delete();

            if ($wasDefault) {
                $request->user()
                    ->wallets()
                    ->orderBy('sort_order')
                    ->orderBy('created_at')
                    ->first()
                    ?->update(['is_default' => true]);
            }
        });

        return redirect()
            ->route('wallets.index')
            ->with('success', 'Wallet deleted.');
    }
}
