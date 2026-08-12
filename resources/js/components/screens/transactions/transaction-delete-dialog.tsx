import type { TTransactionListItem } from '@/types/withs';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';
import { DeleteDialog } from '@/components/elements/delete-dialog';

export const TransactionDeleteDialog = ({
    transaction,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    transaction: TTransactionListItem;
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
            title="Delete transaction?"
            description={
                <>
                    <span className="font-medium text-foreground">
                        "{transaction.description}"
                    </span>{' '}
                    —{' '}
                    {formatCurrency(
                        transaction.amount,
                        transaction.wallet?.currency,
                    )}{' '}
                    on {formatLocalDateLong(transaction.transacted_at)}. Cannot
                    be undone.
                </>
            }
            onConfirm={() =>
                router.delete(route('transactions.destroy', transaction.id), {
                    onSuccess: () => onDeleted?.(),
                })
            }
        />
    );
};
