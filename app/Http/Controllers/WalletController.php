<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Wallets\StoreWalletRequest;
use App\Http\Requests\Wallets\UpdateWalletRequest;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            ->withSum(['transactions as income' => fn ($q) => $q->where('type', Type::Income->value)], 'amount')
            ->withSum(['transactions as expense' => fn ($q) => $q->where('type', Type::Expense->value)], 'amount')
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        $initialBalances = $request->user()
            ->wallets()
            ->selectRaw('currency, SUM(initial_balance) as total')
            ->groupBy('currency')
            ->pluck('total', 'currency');

        $stats = $request->user()
            ->transactions()
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->selectRaw('wallets.currency, transactions.type, SUM(transactions.amount) as total')
            ->groupBy('wallets.currency', 'transactions.type')
            ->get()
            ->groupBy('currency')
            ->map(fn ($rows, $currency) => [
                'currency' => $currency,
                'initial_balance' => (float) ($initialBalances[$currency] ?? 0),
                'income' => (float) ($rows->firstWhere('type', Type::Income->value)?->total ?? 0),
                'expense' => (float) ($rows->firstWhere('type', Type::Expense->value)?->total ?? 0),
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

        $wallet->loadSum(['transactions as income' => fn ($q) => $q->where('type', Type::Income->value)], 'amount');
        $wallet->loadSum(['transactions as expense' => fn ($q) => $q->where('type', Type::Expense->value)], 'amount');

        $transactions = Inertia::scroll(
            $wallet->transactions()
                ->with(['wallet', 'category'])
                ->orderByDesc('transacted_at')
                ->orderByDesc('created_at')
                ->paginate(20)
        );

        return inertia('wallets/show', [
            'wallet' => $wallet,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Wallet $wallet): Response
    {
        abort_if($wallet->user_id !== $request->user()->id, 403);

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

        $wallet->delete();

        return redirect()
            ->route('wallets.index')
            ->with('success', 'Wallet deleted.');
    }
}
