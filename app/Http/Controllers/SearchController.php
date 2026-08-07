<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Search across transactions, wallets, transfers, and categories.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
        ]);

        $query = trim($validated['q'] ?? '');

        if ($query === '') {
            return inertia('search', [
                'query' => '',
                'transactions' => [],
                'wallets' => [],
                'transfers' => [],
                'categories' => [],
                'goals' => [],
                'recurring' => [],
            ]);
        }

        $user = $request->user();
        $like = "%{$query}%";

        $transactions = $user->transactions()
            ->with(['wallet', 'category'])
            ->where(function ($q) use ($like) {
                $q->where('description', 'like', $like)
                    ->orWhere('notes', 'like', $like);
            })
            ->orderByDesc('transacted_at')
            ->limit(10)
            ->get();

        $wallets = $user->wallets()
            ->where('name', 'like', $like)
            ->orderBy('sort_order')
            ->limit(5)
            ->get();

        $transfers = $user->transfers()
            ->with(['fromWallet', 'toWallet'])
            ->where('notes', 'like', $like)
            ->orderByDesc('transacted_at')
            ->limit(5)
            ->get();

        $categories = $user->categories()
            ->where('name', 'like', $like)
            ->orderBy('sort_order')
            ->limit(5)
            ->get();

        $goals = $user->goals()
            ->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('description', 'like', $like);
            })
            ->orderBy('name')
            ->limit(5)
            ->get();

        $recurring = $user->recurringTransactions()
            ->with(['wallet', 'category'])
            ->where('description', 'like', $like)
            ->orderBy('next_due_at')
            ->limit(5)
            ->get();

        return inertia('search', [
            'query' => $query,
            'transactions' => $transactions,
            'wallets' => $wallets,
            'transfers' => $transfers,
            'categories' => $categories,
            'goals' => $goals,
            'recurring' => $recurring,
        ]);
    }
}
