<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Http\Requests\Transactions\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $transactions = $request->user()
            ->transactions()
            ->with(['wallet', 'category'])
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at')
            ->get();

        return inertia('transactions/index', [
            'transactions' => $transactions,
        ]);
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
