<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\Wallets\StoreWalletRequest;
use App\Http\Requests\Wallets\UpdateWalletRequest;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            ->withSum('outgoingTransfers as transfers_out', 'amount')
            ->withSum('incomingTransfers as transfers_in', 'amount')
            ->withCount('transactions')
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->limit(config('limits.wallets'))
            ->get()
            ->each(function (Wallet $wallet) {
                $wallet->setAttribute('income', $wallet->income());
                $wallet->setAttribute('expense', $wallet->expense());
                $wallet->setAttribute('transfers_in', $wallet->transfersIn());
                $wallet->setAttribute('transfers_out', $wallet->transfersOut());
                $wallet->setAttribute('net', $wallet->net());
                $wallet->setAttribute('balance', $wallet->balance());
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
            'stats' => $stats,
            'wallets' => $wallets,
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
        abort_if($request->user()->wallets()->count() >= config('limits.wallets'), 403, 'You have reached the maximum limit of wallets.');

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

        $wallet
            ->loadSum(['transactions as income' => fn ($q) => $q->where('type', Type::Income->value)], 'amount')
            ->loadSum(['transactions as expense' => fn ($q) => $q->where('type', Type::Expense->value)], 'amount')
            ->loadSum(['outgoingTransfers as transfers_out'], 'amount')
            ->loadSum(['incomingTransfers as transfers_in'], 'amount')
            ->setAttribute('transfers_in', $wallet->transfersIn())
            ->setAttribute('transfers_out', $wallet->transfersOut())
            ->setAttribute('net', $wallet->net())
            ->setAttribute('balance', $wallet->balance());

        return inertia('wallets/show', [
            'wallet' => $wallet,
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
