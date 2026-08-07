import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { TTransaction } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';

export const TransactionDeleteDialog = ({
    transaction,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    transaction: TTransaction;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDeleted?: () => void;
    trigger?: ReactElement;
}) => {
    const handleDelete = () => {
        router.delete(route('transactions.destroy', transaction.id), {
            onSuccess: () => onDeleted?.(),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger render={trigger} />}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                        "{transaction.description}" —{' '}
                        {formatCurrency(transaction.amount, transaction.wallet?.currency)}{' '}
                        on {formatLocalDateLong(transaction.transacted_at)}. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
