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
        $wallets = $request->user()->wallets()->orderBy('sort_order')->get();

        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'wallet_id' => ['nullable', 'uuid', Rule::exists('wallets', 'id')->where('user_id', $request->user()->id)],
        ]);

        $query = $request->user()
            ->transfers()
            ->with(['fromWallet', 'toWallet'])
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at');

        if (! empty($validated['date_from'])) {
            $query->whereDate('transacted_at', '>=', $validated['date_from']);
        }

        if (! empty($validated['date_to'])) {
            $query->whereDate('transacted_at', '<=', $validated['date_to']);
        }

        if (! empty($validated['wallet_id'])) {
            $walletId = $validated['wallet_id'];
            $query->where(function ($q) use ($walletId): void {
                $q->where('from_wallet_id', $walletId)
                    ->orWhere('to_wallet_id', $walletId);
            });
        }

        return inertia('transfers/index', [
            'transfers' => Inertia::scroll($query->paginate(20)),
            'wallets' => $wallets,
            'filters' => [
                'date_from' => $validated['date_from'] ?? null,
                'date_to' => $validated['date_to'] ?? null,
                'wallet_id' => $validated['wallet_id'] ?? null,
            ],
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
        $transfer = $request->user()->transfers()->create($request->validated());

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
