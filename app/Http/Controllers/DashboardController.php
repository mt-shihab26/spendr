<?php

namespace App\Http\Controllers;

use App\Enums\Currency;
use App\Enums\Type;
use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard overview.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'currency' => ['nullable', 'string', Rule::enum(Currency::class)],
        ]);

        $user = $request->user();

        $period = $this->period();

        $allWallets = $user->wallets()
            ->withStats()
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get()
            ->each(fn ($w) => $w->setAttribute('balance', $w->balance()));

        $currencies = $allWallets
            ->map(fn (Wallet $w) => $w->currency)
            ->unique()
            ->sort()
            ->values()
            ->all();

        $primaryCurrency = $validated['currency']
            ?? (in_array(Currency::BDT, $currencies, true) ? Currency::BDT->value : ($currencies[0]?->value ?? null));

        $currencyStats = $this->computeCurrencyStats($allWallets, $user, $currencies);

        $primaryWalletIds = $allWallets
            ->when($primaryCurrency, fn ($c) => $c->filter(fn ($w) => $w->currency->value === $primaryCurrency))
            ->pluck('id');

        $recentTransactions = $user->transactions()
            ->with(['wallet', 'category'])
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $upcomingRecurring = $user->recurringTransactions()
            ->with(['wallet', 'category'])
            ->where('is_active', true)
            ->orderBy('next_due_at')
            ->limit(5)
            ->get();

        $goals = $user->goals()
            ->orderByRaw('(current_amount / target_amount) ASC')
            ->limit(4)
            ->get()
            ->map(fn ($goal) => array_merge($goal->toArray(), [
                'progress_percentage' => $goal->progressPercentage(),
            ]));

        return inertia('dashboard', [
            'currency_stats' => $currencyStats,
            'currencies' => array_map(fn (Currency $c) => $c->value, $currencies),
            'primary_currency' => $primaryCurrency,
            'filters' => [
                'currency' => $validated['currency'] ?? null,
            ],
            'wallets' => $allWallets->take(3)->values(),
            'spending_by_category' => $primaryCurrency
                ? $this->computeSpendingByCategory($user, $primaryWalletIds, $period->year, $period->month)
                : [],
            'recent_transactions' => $recentTransactions,
            'budgets' => $primaryCurrency
                ? $this->getBudgetStatus($user, $primaryCurrency, $period->year, $period->month)
                : [],
            'upcoming_recurring' => $upcomingRecurring,
            'goals' => $goals,
        ]);
    }

    /**
     * Return the current and previous month parts as an object.
     */
    private function period(): object
    {
        $now = now();
        $prev = $now->copy()->subMonth();

        return new class((int) $now->year, (int) $now->month, (int) $prev->year, (int) $prev->month)
        {
            public function __construct(
                public readonly int $year,
                public readonly int $month,
                public readonly int $prevYear,
                public readonly int $prevMonth,
            ) {}
        };
    }

    /**
     * Build per-currency balance and income/expense stats for the given month.
     *
     * @param  Collection<int, Wallet>  $wallets
     * @param  array<int, Currency>  $currencies
     * @return array<int, array{currency: string, balance: float, net_worth_delta: float, month_income: float, prev_month_income: float, month_expense: float, prev_month_expense: float}>
     */
    private function computeCurrencyStats(Collection $wallets, User $user, array $currencies): array
    {
        $period = $this->period();

        $sumByType = function (Collection $walletIds, Type $type, int $year, int $month) use ($user): float {
            if ($walletIds->isEmpty()) {
                return 0.0;
            }

            return (float) Transaction::query()
                ->where('transactions.user_id', $user->id)
                ->whereIn('wallet_id', $walletIds)
                ->where('type', $type->value)
                ->whereYear('transacted_at', $year)
                ->whereMonth('transacted_at', $month)
                ->sum('amount');
        };

        return collect($currencies)->map(function (Currency $currency) use ($wallets, $sumByType, $period) {
            $wallets = $wallets->filter(fn ($w) => $w->currency === $currency);

            $walletIds = $wallets->pluck('id');

            $balance = round((float) $wallets->sum('balance'), 2);

            $monthIncome = $sumByType($walletIds, Type::Income, $period->year, $period->month);
            $monthExpense = $sumByType($walletIds, Type::Expense, $period->year, $period->month);
            $prevMonthIncome = $sumByType($walletIds, Type::Income, $period->prevYear, $period->prevMonth);
            $prevMonthExpense = $sumByType($walletIds, Type::Expense, $period->prevYear, $period->prevMonth);

            return [
                'currency' => $currency->value,
                'balance' => $balance,
                'net_worth_delta' => $monthIncome - $monthExpense,
                'month_income' => $monthIncome,
                'prev_month_income' => $prevMonthIncome,
                'month_expense' => $monthExpense,
                'prev_month_expense' => $prevMonthExpense,
            ];
        })->values()->all();
    }

    /**
     * Compute spending by expense category for the given month (top 5 + Other).
     *
     * @param  Collection<int, string>  $walletIds
     * @return array<int, array{name: string, color: string, total: float, percentage: float}>
     */
    private function computeSpendingByCategory(User $user, Collection $walletIds, int $year, int $month): array
    {
        if ($walletIds->isEmpty()) {
            return [];
        }

        $transactions = Transaction::query()
            ->with('category')
            ->where('transactions.user_id', $user->id)
            ->whereIn('wallet_id', $walletIds)
            ->where('type', Type::Expense->value)
            ->whereYear('transacted_at', $year)
            ->whereMonth('transacted_at', $month)
            ->get();

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

        $top = $byCategory->take(5);
        $other = $byCategory->skip(5);

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

    /**
     * Get expense budgets with their current-month spending in the given currency.
     *
     * @return array<int, array{id: string, category: mixed, budget_amount: float, spent: float}>
     */
    private function getBudgetStatus(User $user, string $currency, int $year, int $month): array
    {
        $budgets = Budget::query()
            ->where('user_id', $user->id)
            ->with('category')
            ->get();

        $spending = DB::table('transactions')
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('transactions.user_id', $user->id)
            ->where('wallets.currency', $currency)
            ->where('transactions.type', Type::Expense->value)
            ->whereYear('transactions.transacted_at', $year)
            ->whereMonth('transactions.transacted_at', $month)
            ->whereNull('transactions.deleted_at')
            ->select('transactions.category_id', DB::raw('SUM(transactions.amount) as total'))
            ->groupBy('transactions.category_id')
            ->pluck('total', 'category_id');

        return $budgets
            ->filter(fn ($budget) => isset($budget->amount[$currency]))
            ->map(fn ($budget) => [
                'id' => $budget->id,
                'category' => $budget->category,
                'budget_amount' => (float) $budget->amount[$currency],
                'spent' => (float) ($spending->get($budget->category_id, 0)),
            ])
            ->values()
            ->all();
    }
}
