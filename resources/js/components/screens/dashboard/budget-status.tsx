import type { TCategory } from '@/types/models';
import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { TriangleAlert } from 'lucide-react';
import { ViewAllLink } from '@/components/elements/view-all-link';

export type TBudgetStatus = {
    id: string;
    category: TCategory;
    currency: TCurrency;
    budget_amount: number;
    spent: number;
};

export const BudgetStatus = ({ budgets }: { budgets: TBudgetStatus[] }) => {
    if (budgets.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Budget Status</p>
                <ViewAllLink href={route('budgets.index')}>
                    Manage Budgets
                </ViewAllLink>
            </div>
            <div className="divide-y border">
                {budgets.map((item) => {
                    const isOver = item.spent > item.budget_amount;
                    const pct =
                        item.budget_amount > 0
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
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {formatCurrency(item.spent, item.currency)}{' '}
                                    /{' '}
                                    {formatCurrency(
                                        item.budget_amount,
                                        item.currency,
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
    );
};
