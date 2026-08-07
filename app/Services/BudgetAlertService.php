<?php

namespace App\Services;

use App\Enums\Type;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\BudgetAlert;
use Illuminate\Support\Facades\DB;

class BudgetAlertService
{
    /**
     * Check budget thresholds after a transaction is saved and send alerts if needed.
     */
    public function checkAfterTransaction(Transaction $transaction): void
    {
        if ($transaction->type !== Type::Expense) {
            return;
        }

        $user = User::find($transaction->user_id);

        if (! $user || ! $transaction->category_id) {
            return;
        }

        $budget = $user->budgets()
            ->with('category')
            ->where('category_id', $transaction->category_id)
            ->first();

        if (! $budget) {
            return;
        }

        $month = $transaction->transacted_at->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $spending = DB::table('transactions')
            ->join('wallets', 'transactions.wallet_id', '=', 'wallets.id')
            ->where('transactions.user_id', $user->id)
            ->where('transactions.category_id', $transaction->category_id)
            ->where('transactions.type', Type::Expense->value)
            ->whereYear('transactions.transacted_at', (int) $year)
            ->whereMonth('transactions.transacted_at', (int) $monthNum)
            ->whereNull('transactions.deleted_at')
            ->select('wallets.currency', DB::raw('SUM(transactions.amount) as total'))
            ->groupBy('wallets.currency')
            ->pluck('total', 'currency')
            ->toArray();

        $budgetAmounts = $budget->amount;

        foreach ($spending as $currency => $spent) {
            if (! isset($budgetAmounts[$currency])) {
                continue;
            }

            $limit = (float) $budgetAmounts[$currency];

            if ($limit <= 0) {
                continue;
            }

            $percentage = (int) round(($spent / $limit) * 100);

            foreach ([100, 80] as $threshold) {
                if ($percentage >= $threshold && ! $this->alreadyNotified($user, $budget->id, $currency, $month, $threshold)) {
                    $user->notify(new BudgetAlert(
                        categoryName: $budget->category->name ?? 'Unknown',
                        currency: $currency,
                        spent: (float) $spent,
                        budgetAmount: $limit,
                        percentage: $percentage,
                        threshold: $threshold,
                        budgetId: $budget->id,
                        month: $month,
                    ));
                    break;
                }
            }
        }
    }

    /**
     * Check whether the user has already been notified for this budget/currency/month/threshold combo.
     */
    private function alreadyNotified(User $user, string $budgetId, string $currency, string $month, int $threshold): bool
    {
        return $user->notifications()
            ->where('type', BudgetAlert::class)
            ->whereJsonContains('data->budget_id', $budgetId)
            ->whereJsonContains('data->currency', $currency)
            ->whereJsonContains('data->month', $month)
            ->whereJsonContains('data->threshold', $threshold)
            ->exists();
    }
}
