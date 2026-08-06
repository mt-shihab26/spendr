<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Response;

class ReportsController extends Controller
{
    /**
     * Display trend analysis, category breakdowns, and net cash flow.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $currencies = $user->wallets()
            ->distinct()
            ->orderBy('currency')
            ->pluck('currency')
            ->all();

        $validated = $request->validate([
            'period' => ['nullable', Rule::in(['3m', '6m', '12m'])],
            'currency' => ['nullable', 'string', Rule::in($currencies)],
            'wallet_id' => [
                'nullable',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $user->id),
            ],
        ]);

        $period = $validated['period'] ?? '6m';
        $currency = $validated['currency'] ?? (in_array('BDT', $currencies) ? 'BDT' : ($currencies[0] ?? null));
        $walletId = $validated['wallet_id'] ?? null;

        $months = match ($period) {
            '3m' => 3,
            '12m' => 12,
            default => 6,
        };

        $startDate = now()->subMonths($months)->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        $wallets = $user->wallets()
            ->when($currency, fn ($q) => $q->where('currency', $currency))
            ->orderBy('sort_order')
            ->get();

        $query = $user
            ->transactions()
            ->with('category')
            ->whereBetween('transacted_at', [$startDate, $endDate]);

        if ($currency) {
            $query->whereHas('wallet', fn ($q) => $q->where('currency', $currency));
        }

        if ($walletId && $wallets->contains('id', $walletId)) {
            $query->where('wallet_id', $walletId);
        } else {
            $walletId = null;
        }

        $transactions = $query->get();

        $walletIds = $wallets->pluck('id');
        $balanceQuery = $user->transactions()->whereIn('wallet_id', $walletIds);
        if ($walletId) {
            $balanceQuery->where('wallet_id', $walletId);
        }

        $initialBalance = $walletId
            ? (float) ($wallets->firstWhere('id', $walletId)?->initial_balance ?? 0)
            : (float) $wallets->sum('initial_balance');

        $allTimeIncome = (float) (clone $balanceQuery)->where('type', 'income')->sum('amount');
        $allTimeExpense = (float) (clone $balanceQuery)->where('type', 'expense')->sum('amount');

        $periodIncome = (float) $transactions->where('type', 'income')->sum('amount');
        $periodExpense = (float) $transactions->where('type', 'expense')->sum('amount');

        $monthlyCashFlow = $this->computeMonthlyCashFlow($transactions, $startDate, $endDate);

        return inertia('reports/index', [
            'monthly_cash_flow' => $monthlyCashFlow,
            'monthly_summary' => array_reverse($monthlyCashFlow),
            'expense_breakdown' => $this->computeCategoryBreakdown(
                $transactions->where('type', 'expense')
            ),
            'income_breakdown' => $this->computeCategoryBreakdown(
                $transactions->where('type', 'income')
            ),
            'summary' => [
                'balance' => $initialBalance + $allTimeIncome - $allTimeExpense,
                'income' => $periodIncome,
                'expenses' => $periodExpense,
                'net' => $periodIncome - $periodExpense,
            ],
            'period' => $period,
            'currency' => $currency,
            'wallet_id' => $walletId,
            'currencies' => $currencies,
            'wallets' => $wallets,
        ]);
    }

    /**
     * Build per-month income/expenses/net rows for the given date range.
     *
     * @param  Collection<int, Transaction>  $transactions
     * @return array<int, array{month: string, key: string, income: float, expenses: float, net: float}>
     */
    private function computeMonthlyCashFlow(Collection $transactions, string $startDate, string $endDate): array
    {
        $byMonth = $transactions->groupBy(
            fn ($t) => Carbon::parse($t->transacted_at)->format('Y-m')
        );

        $result = [];
        $current = Carbon::parse($startDate)->startOfMonth();
        $end = Carbon::parse($endDate)->startOfMonth();

        while ($current->lte($end)) {
            $key = $current->format('Y-m');
            $monthTransactions = $byMonth->get($key, collect());

            $income = (float) $monthTransactions->where('type', 'income')->sum('amount');
            $expenses = (float) $monthTransactions->where('type', 'expense')->sum('amount');

            $result[] = [
                'month' => $current->format('M Y'),
                'key' => $key,
                'income' => $income,
                'expenses' => $expenses,
                'net' => $income - $expenses,
                'savings_rate' => $income > 0
                    ? round(max($income - $expenses, 0) / $income * 100, 1)
                    : null,
            ];

            $current = $current->addMonth();
        }

        return $result;
    }

    /**
     * Group transactions by category, return top 6 + "Other".
     *
     * @param  Collection<int, Transaction>  $transactions
     * @return array<int, array{name: string, color: string, total: float, percentage: float}>
     */
    private function computeCategoryBreakdown(Collection $transactions): array
    {
        $total = (float) $transactions->sum('amount');

        if ($total === 0.0) {
            return [];
        }

        $byCategory = $transactions
            ->groupBy('category_id')
            ->map(fn ($group) => [
                'name' => $group->first()->category?->name ?? 'Unknown',
                'color' => $group->first()->category?->color ?? '#6b7280',
                'total' => (float) $group->sum('amount'),
            ])
            ->sortByDesc('total')
            ->values();

        $top = $byCategory->take(6);
        $other = $byCategory->skip(6);

        $result = $top->map(fn ($item) => [
            ...$item,
            'percentage' => round($item['total'] / $total * 100, 1),
        ])->all();

        if ($other->isNotEmpty()) {
            $otherTotal = (float) $other->sum('total');
            $result[] = [
                'name' => 'Other',
                'color' => '#6b7280',
                'total' => $otherTotal,
                'percentage' => round($otherTotal / $total * 100, 1),
            ];
        }

        return $result;
    }
}
