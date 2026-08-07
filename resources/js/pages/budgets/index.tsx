import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TBudget } from '@/types/models';
import type { TCurrency } from '@/types/enums';

import { CircleDollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formats';
import { CURRENCIES_OPTIONS } from '@/lib/currency';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { MonthPicker } from '@/components/elements/month-picker';
import { BudgetsTable } from '@/components/screens/budgets/budgets-table';

const BudgetsIndex = ({
    budgets,
    month,
}: {
    budgets: TBudget[];
    month: string;
}) => {
    const summary = CURRENCIES_OPTIONS.map((currency: TCurrency) => {
        const budgeted = budgets.reduce(
            (sum, b) => sum + (b.amount[currency] ?? 0),
            0,
        );
        const spent = budgets.reduce(
            (sum, b) => sum + (b.spent?.[currency] ?? 0),
            0,
        );
        return { currency, budgeted, spent, remaining: budgeted - spent };
    });

    return (
        <AppLayout
            title="Budgets"
            description="Set monthly spending limits per category"
            breadcrumbs={[{ title: 'Budgets', route: 'budgets.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Budgets (${budgets.length})`}
                        description="Set monthly spending limits per category"
                    />
                    <NewButton href={route('budgets.create')}>
                        New Budget
                    </NewButton>
                </div>

                <div className="flex items-center justify-between">
                    <MonthPicker month={month} href={route('budgets.index')} />
                    {budgets.length > 0 && (
                        <div className="flex gap-6">
                            {summary.map(
                                ({ currency, budgeted, spent, remaining }) => (
                                    <div key={currency} className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            {currency}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span>
                                                <span className="text-muted-foreground">
                                                    Budgeted{' '}
                                                </span>
                                                <span className="font-medium tabular-nums">
                                                    {formatCurrency(
                                                        budgeted,
                                                        currency,
                                                    )}
                                                </span>
                                            </span>
                                            <span>
                                                <span className="text-muted-foreground">
                                                    Spent{' '}
                                                </span>
                                                <span className="font-medium tabular-nums">
                                                    {formatCurrency(
                                                        spent,
                                                        currency,
                                                    )}
                                                </span>
                                            </span>
                                            <span>
                                                <span className="text-muted-foreground">
                                                    Left{' '}
                                                </span>
                                                <span
                                                    className={`font-medium tabular-nums ${remaining < 0 ? 'text-destructive' : ''}`}
                                                >
                                                    {formatCurrency(
                                                        Math.abs(remaining),
                                                        currency,
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>

                {budgets.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <CircleDollarSign />
                            </EmptyMedia>
                            <EmptyTitle>No budgets yet</EmptyTitle>
                            <EmptyDescription>
                                Set a monthly spending limit for each expense
                                category to track your progress.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('budgets.create')}>
                            Create first budget
                        </NewButton>
                    </Empty>
                ) : (
                    <BudgetsTable budgets={budgets} />
                )}
            </div>
        </AppLayout>
    );
};

export default BudgetsIndex;
