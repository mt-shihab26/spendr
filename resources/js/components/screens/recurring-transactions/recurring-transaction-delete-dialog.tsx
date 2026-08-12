import type { TRecurringTransaction } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';

import { Trash2 } from 'lucide-react';
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
    const handleDelete = () => {
        router.delete(route('recurring-transactions.destroy', recurring.id), {
            onSuccess: () => onDeleted?.(),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger render={trigger} />}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete recurring transaction?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>
                            <span className="font-medium text-foreground">
                                {recurring.name}
                            </span>
                            <span>
                                {' '}
                                — {recurring.frequency}, due{' '}
                                {formatLocalDateLong(recurring.next_due_at)}.
                                Cannot be undone.
                            </span>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 />
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
