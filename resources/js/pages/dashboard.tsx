import type { TCategory, TTransaction, TWallet } from '@/types/models';
import type { TCategoryRow } from '@/types/reports';
import type { TCurrency } from '@/types/enums';

import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Minus, TriangleAlert } from 'lucide-react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { CategoryDonut } from '@/components/screens/reports/category-donut';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { Button } from '@/components/ui/button';

import { formatCurrency } from '@/lib/formats';

type TBudgetStatus = {
    id: string;
    category: TCategory;
    budget_amount: number;
    spent: number;
};

const PctChange = ({ current, prev }: { current: number; prev: number }) => {
    if (prev === 0) return null;
    const pct = ((current - prev) / prev) * 100;
    const abs = Math.abs(pct).toFixed(1);

    if (pct > 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-income">
                <ArrowUp className="size-3" />
                {abs}% vs last month
            </span>
        );
    }
    if (pct < 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-expense">
                <ArrowDown className="size-3" />
                {abs}% vs last month
            </span>
        );
    }
    return (
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Minus className="size-3" />
            No change vs last month
        </span>
    );
};

const NetWorthDelta = ({
    delta,
    currency,
}: {
    delta: number;
    currency: TCurrency;
}) => {
    if (delta > 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-income">
                <ArrowUp className="size-3" />+{formatCurrency(delta, currency)} vs last month
            </span>
        );
    }
    if (delta < 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-expense">
                <ArrowDown className="size-3" />
                {formatCurrency(delta, currency)} vs last month
            </span>
        );
    }
    return (
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Minus className="size-3" />
            No change vs last month
        </span>
    );
};

const Dashboard = ({
    currency,
    net_worth,
    net_worth_delta,
    month_income,
    month_expense,
    prev_month_income,
    prev_month_expense,
    wallets,
    spending_by_category,
    recent_transactions,
    budgets,
}: {
    currency: TCurrency | null;
    net_worth: number;
    net_worth_delta: number;
    month_income: number;
    month_expense: number;
    prev_month_income: number;
    prev_month_expense: number;
    wallets: TWallet[];
    spending_by_category: TCategoryRow[];
    recent_transactions: TTransaction[];
    budgets: TBudgetStatus[];
}) => {
    const displayCurrency = currency ?? 'BDT';

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

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            {formatCurrency(net_worth, displayCurrency)}
                        </p>
                        <NetWorthDelta delta={net_worth_delta} currency={displayCurrency} />
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">This Month Income</p>
                        <p className="mt-1 text-lg font-semibold text-income tabular-nums">
                            {formatCurrency(month_income, displayCurrency)}
                        </p>
                        <PctChange current={month_income} prev={prev_month_income} />
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">This Month Expenses</p>
                        <p className="mt-1 text-lg font-semibold text-expense tabular-nums">
                            {formatCurrency(month_expense, displayCurrency)}
                        </p>
                        <PctChange current={month_expense} prev={prev_month_expense} />
                    </div>
                </div>

                {/* Wallets + Spending by Category */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Wallets Panel */}
                    <div className="border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium">Wallets</p>
                            <Link
                                href={route('wallets.index')}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                All Wallets →
                            </Link>
                        </div>
                        {wallets.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <p className="text-xs text-muted-foreground">
                                    No wallets yet.
                                </p>
                                <Button
                                    size="sm"
                                    nativeButton={false}
                                    render={
                                        <Link href={route('wallets.create')} />
                                    }
                                >
                                    Create your first wallet
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y">
                                    {wallets.map((wallet) => (
                                        <div
                                            key={wallet.id}
                                            className="flex items-center gap-2 py-2"
                                        >
                                            <span
                                                className="size-2 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: wallet.color,
                                                }}
                                            />
                                            <span className="flex-1 truncate text-xs">
                                                {wallet.name}
                                            </span>
                                            <span className="shrink-0 text-xs font-medium tabular-nums">
                                                {formatCurrency(
                                                    wallet.balance ?? 0,
                                                    wallet.currency,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Spending by Category */}
                    <div className="flex flex-col gap-2">
                        <CategoryDonut
                            title="Spending by Category"
                            data={spending_by_category}
                            currency={displayCurrency}
                        />
                        <div className="text-right">
                            <Link
                                href={route('reports.index')}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                View Full Report →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Recent Transactions</p>
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
                                const pct = item.budget_amount > 0
                                    ? Math.min(
                                          (item.spent / item.budget_amount) * 100,
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
                                            <span className="text-xs tabular-nums text-muted-foreground">
                                                {formatCurrency(item.spent, displayCurrency)}{' '}
                                                /{' '}
                                                {formatCurrency(item.budget_amount, displayCurrency)}
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
            </div>
        </AppLayout>
    );
};

export default Dashboard;
