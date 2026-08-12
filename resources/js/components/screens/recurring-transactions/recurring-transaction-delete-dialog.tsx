import type { TRecurringTransaction } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';

import { DeleteDialog } from '@/components/elements/delete-dialog';

export const RecurringTransactionDeleteDialog = ({
    recurring,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    recurring: TRecurringTransaction;
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
            title="Delete recurring transaction?"
            description={
                <>
                    <span className="font-medium text-foreground">
                        {recurring.name}
                    </span>{' '}
                    — {recurring.frequency}, due{' '}
                    {formatLocalDateLong(recurring.next_due_at)}. Cannot be
                    undone.
                </>
            }
            onConfirm={() =>
                router.delete(
                    route('recurring-transactions.destroy', recurring.id),
                    { onSuccess: () => onDeleted?.() },
                )
            }
        />
    );
};
