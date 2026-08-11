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
        $request->validate([
            'currency' => ['nullable', 'string', Rule::enum(Currency::class)],
        ]);

        $user = $request->user();

        $period = $this->period();

        $wallets = $this->getWallets($user);

        $currencies = $wallets
            ->map(fn (Wallet $w) => $w->currency)
            ->unique()
            ->sort()
            ->values()
            ->all();

        $primaryCurrency = $request->input('currency')
            ?? (in_array(Currency::BDT, $currencies, true) ? Currency::BDT->value : (isset($currencies[0]) ? $currencies[0]->value : null));

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
            'currencyStats' => $this->computeCurrencyStats($user, $wallets, $currencies),
            'wallets' => $this->computeTopWallets($wallets),
            'spendingCategories' => $this->computeSpendingByCategory($user, $wallets),

            'currencies' => array_map(fn (Currency $c) => $c->value, $currencies),
            'primary_currency' => $primaryCurrency,
            'filters' => [
                'currency' => $request->input('currency'),
            ],
            'recent_transactions' => $recentTransactions,
            'budgets' => $primaryCurrency
                ? $this->getBudgetStatus($user, $primaryCurrency, $period->year, $period->month)
                : [],
            'upcoming_recurring' => $upcomingRecurring,
            'goals' => $goals,
        ]);
    }

    /**
     * Load all user wallets with balance computed from aggregated stats.
     *
     * @return Collection<int, Wallet>
     */
    private function getWallets(User $user): Collection
    {
        return $user->wallets()
            ->withStats()
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get()
            ->each(fn ($w) => $w->setAttribute('balance', $w->balance()));
    }

    /**
     * Return the current and previous month parts as an object.
     *
     * @return object{year: int, month: int, prevYear: int, prevMonth: int}
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
     * @param  array<int, Currency>  $currencies
     * @param  Collection<int, Wallet>  $wallets
     * @return array<int, array{currency: string, balance: float, net_worth_delta: float, month_income: float, prev_month_income: float, month_expense: float, prev_month_expense: float}>
     */
    private function computeCurrencyStats(User $user, Collection $wallets, array $currencies): array
    {
        $period = $this->period();

        $transactionSumByType = function (Collection $walletIds, Type $type, int $year, int $month) use ($user): float {
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

        return collect($currencies)
            ->map(function (Currency $currency) use ($wallets, $period, $transactionSumByType) {
                $wallets = $wallets->filter(fn ($w) => $w->currency === $currency);
                $walletIds = $wallets->pluck('id');
                $monthIncome = $transactionSumByType($walletIds, Type::Income, $period->year, $period->month);
                $monthExpense = $transactionSumByType($walletIds, Type::Expense, $period->year, $period->month);
                $prevMonthIncome = $transactionSumByType($walletIds, Type::Income, $period->prevYear, $period->prevMonth);
                $prevMonthExpense = $transactionSumByType($walletIds, Type::Expense, $period->prevYear, $period->prevMonth);

                return [
                    'currency' => $currency->value,
                    'balance' => round((float) $wallets->sum('balance'), 2),
                    'net_worth_delta' => $monthIncome - $monthExpense,
                    'month_income' => $monthIncome,
                    'prev_month_income' => $prevMonthIncome,
                    'month_expense' => $monthExpense,
                    'prev_month_expense' => $prevMonthExpense,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Return the top 5 wallets for display.
     *
     * @param  Collection<int, Wallet>  $wallets
     * @return Collection<int, Wallet>
     */
    private function computeTopWallets(Collection $wallets): Collection
    {
        return $wallets->take(5)->values();
    }

    /**
     * Compute spending by expense category for the given month across all currencies.
     * Each category entry contains per-currency totals and percentages.
     *
     * @param  Collection<int, Wallet>  $wallets
     * @return array<int, array{name: string, color: string, total: array<string, float>, percentage: array<string, float>}>
     */
    private function computeSpendingByCategory(User $user, Collection $wallets): array
    {
        $wallets = $this->computeTopWallets($wallets);

        if ($wallets->isEmpty()) {
            return [];
        }

        $period = $this->period();

        $walletCurrencyMap = $wallets->pluck('currency', 'id')
            ->map(fn (Currency $c) => $c->value);

        $transactions = Transaction::query()
            ->with('category')
            ->where('transactions.user_id', $user->id)
            ->whereIn('wallet_id', $wallets->pluck('id'))
            ->where('type', Type::Expense->value)
            ->whereYear('transacted_at', $period->year)
            ->whereMonth('transacted_at', $period->month)
            ->get()
            ->each(fn ($t) => $t->setAttribute('currency', $walletCurrencyMap[$t->wallet_id] ?? ''));

        if ($transactions->isEmpty()) {
            return [];
        }

        $totalByCurrency = $transactions
            ->groupBy('currency')
            ->map(fn ($g) => (float) $g->sum('amount'));

        return $transactions
            ->groupBy('category_id')
            ->map(function ($group) use ($totalByCurrency) {
                $first = $group->first();
                $totalPerCurrency = $group->groupBy('currency')->map(fn ($g) => (float) $g->sum('amount'));

                return [
                    'name' => $first->category->name,
                    'color' => $first->category->color,
                    'total' => $totalPerCurrency->all(),
                    'percentage' => $totalPerCurrency
                        ->mapWithKeys(fn ($amount, $currency) => [
                            $currency => $totalByCurrency[$currency] > 0
                                ? round($amount / $totalByCurrency[$currency] * 100, 1)
                                : 0.0,
                        ])
                        ->all(),
                ];
            })
            ->sortByDesc(fn ($c) => array_sum($c['total']))
            ->values()
            ->all();
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
