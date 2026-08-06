import type { TBudget } from '@/types/models';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formats';
import { CURRENCIES_OPTIONS } from '@/lib/currency';

import { Link } from '@inertiajs/react';
import { IconBadge } from '@/components/elements/icon-badge';
import { BudgetActions } from '@/components/screens/budgets/budget-actions';
import { BudgetDeleteDialog } from '@/components/screens/budgets/budget-delete-dialog';

export const BudgetsTable = ({ budgets }: { budgets: TBudget[] }) => {
    const [toDelete, setToDelete] = useState<TBudget | null>(null);

    return (
        <>
            <div className="divide-y border">
                {budgets.map((budget) => (
                    <div
                        key={budget.id}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <IconBadge
                            icon={budget.category?.icon}
                            color={budget.category?.color}
                        />
                        <div className="flex w-40 flex-col">
                            <Link
                                href={route('budgets.show', budget.id)}
                                className="text-sm font-medium hover:underline"
                            >
                                {budget.category?.name ?? '—'}
                            </Link>
                            <span className="text-xs text-muted-foreground capitalize">
                                {budget.category?.type}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            {CURRENCIES_OPTIONS.map((currency) => {
                                const limit = budget.amount[currency] ?? 0;
                                const spent = budget.spent?.[currency] ?? 0;
                                const remaining = limit - spent;
                                const pct = limit > 0 ? (spent / limit) * 100 : 0;

                                return (
                                    <div key={currency} className="flex items-center gap-3">
                                        <span className="w-8 text-xs text-muted-foreground">
                                            {currency}
                                        </span>
                                        <div className="flex-1">
                                            <div className="mb-1 flex justify-between text-xs">
                                                <span className="tabular-nums text-muted-foreground">
                                                    {formatCurrency(spent, currency)} spent
                                                </span>
                                                <span className={cn('tabular-nums', remaining < 0 ? 'text-destructive' : 'text-muted-foreground')}>
                                                    {remaining < 0 ? '−' : ''}{formatCurrency(Math.abs(remaining), currency)} {remaining >= 0 ? 'left' : 'over'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full transition-all',
                                                        pct >= 100 ? 'bg-destructive' : pct >= 80 ? 'bg-amber-500' : 'bg-primary',
                                                    )}
                                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="w-16 text-right text-xs font-medium tabular-nums">
                                            {formatCurrency(limit, currency)}
                                            <span className="ml-0.5 font-normal text-muted-foreground">
                                                /mo
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <BudgetActions budget={budget} onDelete={setToDelete} />
                    </div>
                ))}
            </div>
            {toDelete && (
                <BudgetDeleteDialog
                    budget={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </>
    );
};
