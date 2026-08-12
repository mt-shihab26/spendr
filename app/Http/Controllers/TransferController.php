<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transfers\StoreTransferRequest;
use App\Http\Requests\Transfers\UpdateTransferRequest;
use App\Models\Transfer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'wallet_id' => ['nullable', 'uuid', Rule::exists('wallets', 'id')->where('user_id', $request->user()->id)],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $wallets = $request->user()
            ->wallets()
            ->orderBy('sort_order')
            ->get();

        $transfers = $request->user()
            ->transfers()
            ->with(['fromWallet', 'toWallet'])
            ->when(! empty($filters['wallet_id']), function ($q) use ($filters): void {
                $q->where(fn ($q) => $q
                    ->where('from_wallet_id', $filters['wallet_id'])->orWhere('to_wallet_id', $filters['wallet_id'])
                );
            })
            ->when(! empty($filters['date_from']), fn ($q) => $q->whereDate('transacted_at', '>=', $filters['date_from']))
            ->when(! empty($filters['date_to']), fn ($q) => $q->whereDate('transacted_at', '<=', $filters['date_to']))
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at')
            ->paginate(20);

        return inertia('transfers/index', [
            'filters' => $filters,
            'wallets' => $wallets,
            'transfers' => Inertia::scroll($transfers),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();

        return inertia('transfers/create', [
            'wallets' => $wallets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransferRequest $request): RedirectResponse
    {
        $request->user()->transfers()->create($request->validated());

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Transfer $transfer): Response
    {
        abort_if($transfer->user_id !== $request->user()->id, 403);

        $transfer->load(['fromWallet', 'toWallet']);

        return inertia('transfers/show', [
            'transfer' => $transfer,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Transfer $transfer): Response
    {
        abort_if($transfer->user_id !== $request->user()->id, 403);

        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();

        return inertia('transfers/edit', [
            'transfer' => $transfer,
            'wallets' => $wallets,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransferRequest $request, Transfer $transfer): RedirectResponse
    {
        abort_if($transfer->user_id !== $request->user()->id, 403);

        $transfer->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Transfer updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transfer $transfer): RedirectResponse
    {
        abort_if($transfer->user_id !== $request->user()->id, 403);

        $transfer->delete();

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer deleted.');
    }
}
