import type { TBudget } from '@/types/models';

import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { IconBadge } from '@/components/elements/icon-badge';
import { BudgetProgress } from '@/components/screens/budgets/budget-progress';
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
                        <div className="flex-1">
                            <BudgetProgress
                                amount={budget.amount}
                                spent={budget.spent}
                            />
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
