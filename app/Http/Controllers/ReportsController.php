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
            'currency' => ['nullable', 'string', Rule::in($currencies)],
            'wallet_id' => [
                'nullable',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $user->id),
            ],
            'date_from' => ['nullable', 'date', 'before_or_equal:date_to', 'required_with:date_to'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from', 'required_with:date_from'],
        ]);

        $currency = $validated['currency'] ?? (in_array('BDT', $currencies) ? 'BDT' : ($currencies[0] ?? null));
        $walletId = $validated['wallet_id'] ?? null;
        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;

        if ($dateFrom && $dateTo) {
            $startDate = Carbon::parse($dateFrom)->startOfDay()->toDateString();
            $endDate = Carbon::parse($dateTo)->endOfDay()->toDateString();
        } elseif ($dateFrom === null && $dateTo === null && $request->has('date_from')) {
            $startDate = null;
            $endDate = null;
        } else {
            $startDate = now()->subMonths(6)->startOfMonth()->toDateString();
            $endDate = now()->endOfMonth()->toDateString();
            $dateFrom = null;
            $dateTo = null;
        }

        $wallets = $user->wallets()
            ->when($currency, fn ($q) => $q->where('currency', $currency))
            ->orderBy('sort_order')
            ->get();

        $query = $user
            ->transactions()
            ->with('category')
            ->when($startDate && $endDate, fn ($q) => $q->whereBetween('transacted_at', [$startDate, $endDate]));

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
            ? (float) $wallets->firstWhere('id', $walletId)->initial_balance
            : (float) $wallets->sum('initial_balance');

        $allTimeIncome = (float) (clone $balanceQuery)->where('type', 'income')->sum('amount');
        $allTimeExpense = (float) (clone $balanceQuery)->where('type', 'expense')->sum('amount');

        $transfersOut = (float) $user->transfers()
            ->when($walletId, fn ($q) => $q->where('from_wallet_id', $walletId), fn ($q) => $q->whereIn('from_wallet_id', $walletIds))
            ->sum('amount');

        $transfersIn = (float) $user->transfers()
            ->when($walletId, fn ($q) => $q->where('to_wallet_id', $walletId), fn ($q) => $q->whereIn('to_wallet_id', $walletIds))
            ->sum('amount');

        $periodIncome = (float) $transactions->where('type', 'income')->sum('amount');
        $periodExpense = (float) $transactions->where('type', 'expense')->sum('amount');

        $monthlyCashFlow = $this->computeMonthlyCashFlow($transactions, $startDate, $endDate);

        $allTimeTransactions = $user->transactions()
            ->with('category')
            ->when($currency, fn ($q) => $q->whereHas('wallet', fn ($q) => $q->where('currency', $currency)))
            ->when($walletId, fn ($q) => $q->where('wallet_id', $walletId))
            ->get();

        return inertia('reports/index', [
            'currencies' => $currencies,
            'balance' => $initialBalance + $allTimeIncome - $allTimeExpense - $transfersOut + $transfersIn,
            'monthly_cash_flow' => $monthlyCashFlow,
            'monthly_summary' => array_reverse($monthlyCashFlow),
            'expense_breakdown' => $this->computeCategoryBreakdown(
                $transactions->where('type', 'expense')
            ),
            'income_breakdown' => $this->computeCategoryBreakdown(
                $transactions->where('type', 'income')
            ),
            'summary' => [
                'income' => $periodIncome,
                'expenses' => $periodExpense,
                'net' => $periodIncome - $periodExpense,
            ],
            'net_worth_history' => $this->computeNetWorthHistory($allTimeTransactions, $initialBalance),
            'year_over_year' => $this->computeYearOverYear($allTimeTransactions),
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'currency' => $currency,
            'wallet_id' => $walletId,
            'wallets' => $wallets,
        ]);
    }

    /**
     * Build per-month income/expenses/net rows for the given date range.
     *
     * @param  Collection<int, Transaction>  $transactions
     * @return array<int, array{month: string, key: string, income: float, expenses: float, net: float}>
     */
    private function computeMonthlyCashFlow(Collection $transactions, ?string $startDate, ?string $endDate): array
    {
        if ($transactions->isEmpty()) {
            return [];
        }

        $byMonth = $transactions->groupBy(
            fn ($t) => Carbon::parse($t->transacted_at)->format('Y-m')
        );

        $resolvedStart = $startDate ?? $transactions->min('transacted_at');
        $resolvedEnd = $endDate ?? $transactions->max('transacted_at');

        $result = [];
        $current = Carbon::parse($resolvedStart)->startOfMonth();
        $end = Carbon::parse($resolvedEnd)->startOfMonth();

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
     * Compute cumulative net worth per month from the beginning of transaction history.
     *
     * @param  Collection<int, Transaction>  $transactions
     * @return array<int, array{month: string, key: string, net_worth: float}>
     */
    private function computeNetWorthHistory(Collection $transactions, float $initialBalance): array
    {
        if ($transactions->isEmpty()) {
            return [];
        }

        $byMonth = $transactions->groupBy(
            fn ($t) => Carbon::parse($t->transacted_at)->format('Y-m')
        );

        $earliest = Carbon::parse($transactions->min('transacted_at'))->startOfMonth();
        $latest = Carbon::parse($transactions->max('transacted_at'))->startOfMonth();

        $result = [];
        $cumulative = $initialBalance;
        $current = $earliest->copy();

        while ($current->lte($latest)) {
            $key = $current->format('Y-m');
            $monthTransactions = $byMonth->get($key, collect());

            $cumulative += (float) $monthTransactions->where('type', 'income')->sum('amount');
            $cumulative -= (float) $monthTransactions->where('type', 'expense')->sum('amount');

            $result[] = [
                'month' => $current->format('M Y'),
                'key' => $key,
                'net_worth' => round($cumulative, 2),
            ];

            $current = $current->addMonth();
        }

        return $result;
    }

    /**
     * Compute year-over-year monthly income and expenses for current vs previous year.
     *
     * @param  Collection<int, Transaction>  $transactions
     * @return array<int, array{month: string, current_income: float, current_expenses: float, prev_income: float, prev_expenses: float}>
     */
    private function computeYearOverYear(Collection $transactions): array
    {
        $currentYear = now()->year;
        $prevYear = $currentYear - 1;

        $byMonthYear = $transactions->groupBy(
            fn ($t) => Carbon::parse($t->transacted_at)->format('Y-m')
        );

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return collect($months)->map(function ($month, $index) use ($byMonthYear, $currentYear, $prevYear) {
            $num = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
            $currentKey = "{$currentYear}-{$num}";
            $prevKey = "{$prevYear}-{$num}";

            $current = $byMonthYear->get($currentKey, collect());
            $prev = $byMonthYear->get($prevKey, collect());

            return [
                'month' => $month,
                'current_income' => (float) $current->where('type', 'income')->sum('amount'),
                'current_expenses' => (float) $current->where('type', 'expense')->sum('amount'),
                'prev_income' => (float) $prev->where('type', 'income')->sum('amount'),
                'prev_expenses' => (float) $prev->where('type', 'expense')->sum('amount'),
            ];
        })->all();
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
                'name' => $group->first()->category->name ?? 'Unknown',
                'color' => $group->first()->category->color ?? '#6b7280',
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
