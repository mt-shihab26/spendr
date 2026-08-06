import type { TBudget } from '@/types/models';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formats';

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
                        <div className="flex flex-1 flex-col">
                            <span className="text-sm font-medium">
                                {budget.category?.name ?? '—'}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                                {budget.category?.type}
                            </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                            {formatCurrency(budget.amount)}
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                / mo
                            </span>
                        </span>
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
