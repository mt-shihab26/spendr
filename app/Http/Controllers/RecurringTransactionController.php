<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecurringTransactions\StoreRecurringTransactionRequest;
use App\Http\Requests\RecurringTransactions\UpdateRecurringTransactionRequest;
use App\Models\RecurringTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class RecurringTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'is_active' => ['nullable', 'boolean'],
        ]);

        $recurring = $request->user()
            ->recurringTransactions()
            ->with(['wallet', 'category'])
            ->when(isset($validated['is_active']), fn ($q) => $q->where('is_active', $validated['is_active']))
            ->orderBy('next_due_at')
            ->limit(config('limits.recurring_transactions'))
            ->get();

        return inertia('recurring-transactions/index', [
            'recurring' => $recurring,
            'filters' => [
                'is_active' => $validated['is_active'] ?? null,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        return inertia('recurring-transactions/create', [
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecurringTransactionRequest $request): RedirectResponse
    {
        abort_if($request->user()->recurringTransactions()->count() >= config('limits.recurring_transactions'), 403, 'You have reached the maximum limit of recurring transactions.');

        $validated = $request->validated();
        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        $recurring = $request->user()->recurringTransactions()->create($validated);

        return redirect()
            ->route('recurring-transactions.show', $recurring)
            ->with('success', 'Recurring transaction created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, RecurringTransaction $recurringTransaction): Response
    {
        abort_if($recurringTransaction->user_id !== $request->user()->id, 403);

        $recurringTransaction->load(['wallet', 'category']);

        return inertia('recurring-transactions/show', [
            'recurring' => $recurringTransaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, RecurringTransaction $recurringTransaction): Response
    {
        abort_if($recurringTransaction->user_id !== $request->user()->id, 403);

        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();
        $categories = $request->user()->categories()->orderBy('sort_order')->get();

        return inertia('recurring-transactions/edit', [
            'recurring' => $recurringTransaction->load(['wallet', 'category']),
            'wallets' => $wallets,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecurringTransactionRequest $request, RecurringTransaction $recurringTransaction): RedirectResponse
    {
        abort_if($recurringTransaction->user_id !== $request->user()->id, 403);

        $validated = $request->validated();
        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        $recurringTransaction->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Recurring transaction updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, RecurringTransaction $recurringTransaction): RedirectResponse
    {
        abort_if($recurringTransaction->user_id !== $request->user()->id, 403);

        $recurringTransaction->delete();

        return redirect()
            ->route('recurring-transactions.index')
            ->with('success', 'Recurring transaction deleted.');
    }
}
