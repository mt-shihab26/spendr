<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard overview.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $currencies = $user->wallets()
            ->distinct()
            ->orderBy('currency')
            ->pluck('currency')
            ->map(fn ($c) => $c instanceof \BackedEnum ? $c->value : (string) $c)
            ->all();

        $currency = in_array('BDT', $currencies) ? 'BDT' : ($currencies[0] ?? null);

        $now = now();
        [$year, $monthNum] = [(int) $now->year, (int) $now->month];
        $prevDate = $now->copy()->subMonth();
        [$prevYear, $prevMonthNum] = [(int) $prevDate->year, (int) $prevDate->month];

        $wallets = $user->wallets()
            ->withStats()
            ->when($currency, fn ($q) => $q->where('currency', $currency))
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get()
            ->each(fn ($w) => $w->setAttribute('balance', $w->currentBalance()));

        $walletIds = $wallets->pluck('id');

        $netWorth = (float) $wallets->sum('balance');

        $monthIncome = $this->sumByType($user->id, $walletIds, Type::Income, $year, $monthNum);
        $monthExpense = $this->sumByType($user->id, $walletIds, Type::Expense, $year, $monthNum);
        $prevMonthIncome = $this->sumByType($user->id, $walletIds, Type::Income, $prevYear, $prevMonthNum);
        $prevMonthExpense = $this->sumByType($user->id, $walletIds, Type::Expense, $prevYear, $prevMonthNum);

        $recentTransactions = $user->transactions()
            ->with(['wallet', 'category'])
            ->orderByDesc('transacted_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return inertia('dashboard', [
            'currency' => $currency,
            'net_worth' => $netWorth,
            'net_worth_delta' => $monthIncome - $monthExpense,
            'month_income' => $monthIncome,
            'month_expense' => $monthExpense,
            'prev_month_income' => $prevMonthIncome,
            'prev_month_expense' => $prevMonthExpense,
            'wallets' => $wallets->take(3)->values(),
            'spending_by_category' => $this->computeSpendingByCategory($user->id, $walletIds, $year, $monthNum),
            'recent_transactions' => $recentTransactions,
            'budgets' => $currency ? $this->getBudgetStatus($user->id, $currency, $year, $monthNum) : [],
        ]);
    }

    /**
     * Sum transactions of a given type for the specified month.
     *
     * @param  Collection<int, string>  $walletIds
     */
    private function sumByType(string $userId, Collection $walletIds, Type $type, int $year, int $month): float
    {
        return (float) Transaction::query()
            ->where('transactions.user_id', $userId)
            ->whereIn('wallet_id', $walletIds)
            ->where('type', $type->value)
            ->whereYear('transacted_at', $year)
            ->whereMonth('transacted_at', $month)
            ->sum('amount');
    }

    /**
     * Compute spending by expense category for the given month (top 5 + Other).
     *
     * @param  Collection<int, string>  $walletIds
     * @return array<int, array{name: string, color: string, total: float, percentage: float}>
     */
    private function computeSpendingByCategory(string $userId, Collection $walletIds, int $year, int $month): array
    {
        $transactions = Transaction::query()
            ->with('category')
            ->where('transactions.user_id', $userId)
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
                'name' => $group->first()->category?->name ?? 'Unknown',
                'color' => $group->first()->category?->color ?? '#6b7280',
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
    private function getBudgetStatus(string $userId, string $currency, int $year, int $month): array
    {
        $budgets = Budget::query()
            ->where('user_id', $userId)
            ->with('category')
            ->get();

        $spending = DB::table('transactions')
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('transactions.user_id', $userId)
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
