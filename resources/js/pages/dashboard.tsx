import type {
    TCategory,
    TGoal,
    TRecurringTransaction,
    TTransaction,
} from '@/types/models';

import type { TCategoryRow } from '@/types/reports';
import type { TCurrency } from '@/types/enums';
import type { TCurrencyStat } from '@/components/screens/dashboard/currency-stats';
import type { TDashboardWallet } from '@/components/screens/dashboard/wallet-overview';

import { formatCurrency } from '@/lib/formats';

import { Link } from '@inertiajs/react';
import { RefreshCw, Target, TriangleAlert } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { CategoryDonut } from '@/components/screens/reports/category-donut';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { CurrencyStats } from '@/components/screens/dashboard/currency-stats';
import { WalletOverview } from '@/components/screens/dashboard/wallet-overview';
import { SpendingByCategory } from '@/components/screens/dashboard/spending-by-category';

type TBudgetStatus = {
    id: string;
    category: TCategory;
    budget_amount: number;
    spent: number;
};

const Dashboard = ({
    currencyStats,
    wallets,
    primary_currency,
    spending_by_category,
    recent_transactions,
    budgets,
    upcoming_recurring,
    goals,
}: {
    currencyStats: TCurrencyStat[];
    wallets: TDashboardWallet[];
    primary_currency: TCurrency | null;
    spending_by_category: TCategoryRow[];
    recent_transactions: TTransaction[];
    budgets: TBudgetStatus[];
    upcoming_recurring: TRecurringTransaction[];
    goals: TGoal[];
}) => {
    const displayCurrency = primary_currency ?? 'BDT';

    return (
        <AppLayout
            title="Dashboard"
            description="Overview of your account"
            breadcrumbs={[{ title: 'Dashboard', route: 'dashboard' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Dashboard"
                        description="Overview of your account"
                    />
                    <NewButton href={route('transactions.create')}>
                        Add Transaction
                    </NewButton>
                </div>
                <CurrencyStats currencyStats={currencyStats} />
                <div className="flex gap-4">
                    <WalletOverview wallets={wallets} />
                    <SpendingByCategory
                        primary_currency={primary_currency}
                        spending_by_category={spending_by_category}
                    />
                </div>
                <div className="text-right">
                    <Link
                        href={route('reports.index')}
                        className="text-xs text-muted-foreground hover:underline"
                    >
                        View Full Report →
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">
                            Recent Transactions
                        </p>
                        <Link
                            href={route('transactions.index')}
                            className="text-xs text-muted-foreground hover:underline"
                        >
                            View All →
                        </Link>
                    </div>
                    {recent_transactions.length === 0 ? (
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">
                                No transactions yet.
                            </p>
                        </div>
                    ) : (
                        <TransactionsTable transactions={recent_transactions} />
                    )}
                </div>

                {/* Budget Status */}
                {budgets.length > 0 && (
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium">Budget Status</p>
                            <Link
                                href={route('budgets.index')}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                Manage Budgets →
                            </Link>
                        </div>
                        <div className="divide-y border">
                            {budgets.map((item) => {
                                const isOver = item.spent > item.budget_amount;
                                const pct =
                                    item.budget_amount > 0
                                        ? Math.min(
                                              (item.spent /
                                                  item.budget_amount) *
                                                  100,
                                              100,
                                          )
                                        : 0;

                                return (
                                    <div key={item.id} className="px-4 py-3">
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium">
                                                    {item.category.name}
                                                </span>
                                                {isOver && (
                                                    <span className="flex items-center gap-0.5 text-xs text-destructive">
                                                        <TriangleAlert className="size-3" />
                                                        Over
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground tabular-nums">
                                                {formatCurrency(
                                                    item.spent,
                                                    displayCurrency,
                                                )}{' '}
                                                /{' '}
                                                {formatCurrency(
                                                    item.budget_amount,
                                                    displayCurrency,
                                                )}
                                            </span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full transition-all ${isOver ? 'bg-destructive' : 'bg-primary'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Goals + Upcoming Recurring */}
                {(goals.length > 0 || upcoming_recurring.length > 0) && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Goals */}
                        {goals.length > 0 && (
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-medium">Goals</p>
                                    <Link
                                        href={route('goals.index')}
                                        className="text-xs text-muted-foreground hover:underline"
                                    >
                                        All Goals →
                                    </Link>
                                </div>
                                <div className="divide-y border">
                                    {goals.map((goal) => {
                                        const pct =
                                            goal.progress_percentage ?? 0;
                                        return (
                                            <Link
                                                key={goal.id}
                                                href={route(
                                                    'goals.show',
                                                    goal.id,
                                                )}
                                                className="block px-4 py-3 hover:bg-muted/50"
                                            >
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className="flex size-5 items-center justify-center rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    goal.color +
                                                                    '20',
                                                                color: goal.color,
                                                            }}
                                                        >
                                                            <Target className="size-3" />
                                                        </div>
                                                        <span className="text-xs font-medium">
                                                            {goal.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground tabular-nums">
                                                        {pct.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${Math.min(100, pct)}%`,
                                                            backgroundColor:
                                                                goal.color,
                                                        }}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Recurring */}
                        {upcoming_recurring.length > 0 && (
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        Upcoming Recurring
                                    </p>
                                    <Link
                                        href={route(
                                            'recurring-transactions.index',
                                        )}
                                        className="text-xs text-muted-foreground hover:underline"
                                    >
                                        All Recurring →
                                    </Link>
                                </div>
                                <div className="divide-y border">
                                    {upcoming_recurring.map((r) => (
                                        <Link
                                            key={r.id}
                                            href={route(
                                                'recurring-transactions.show',
                                                r.id,
                                            )}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                                        >
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                                                <RefreshCw className="size-3 text-muted-foreground" />
                                            </span>
                                            <div className="flex flex-1 flex-col">
                                                <span className="text-xs font-medium">
                                                    {r.description}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {r.frequency} · due{' '}
                                                    {r.next_due_at}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold tabular-nums">
                                                {r.wallet
                                                    ? formatCurrency(
                                                          r.amount,
                                                          r.wallet.currency,
                                                      )
                                                    : r.amount.toFixed(2)}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Dashboard;
