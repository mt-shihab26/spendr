import type { TBudget } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { DeleteDialog } from '@/components/elements/delete-dialog';

export const BudgetDeleteDialog = ({
    budget,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    budget: TBudget;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDeleted?: () => void;
    trigger?: ReactElement;
}) => {
    return (
        <DeleteDialog
            open={open}
            onOpenChange={onOpenChange}
            trigger={trigger}
            title="Delete this budget?"
            description="This cannot be undone. The category will no longer have a spending limit."
            onConfirm={() =>
                router.delete(route('budgets.destroy', budget.id), {
                    onSuccess: () => onDeleted?.(),
                })
            }
        />
    );
};
