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

import type { TTransfer, TWallet } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';

import { ArrowRight, Trash2 } from 'lucide-react';

export const TransferDeleteDialog = ({
    transfer,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    transfer: TTransfer & {
        from_wallet: TWallet;
        to_wallet: TWallet;
    };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDeleted?: () => void;
    trigger?: ReactElement;
}) => {
    const handleDelete = () => {
        router.delete(route('transfers.destroy', transfer.id), {
            onSuccess: () => onDeleted?.(),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger render={trigger} />}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete transfer?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>
                            <div className="flex items-center gap-1">
                                <span>{transfer.from_wallet.name}</span>
                                <ArrowRight className="size-3" />
                                <span>{transfer.to_wallet.name}</span>
                                <span className="font-medium">
                                    {formatCurrency(
                                        transfer.amount,
                                        transfer.from_wallet?.currency,
                                    )}
                                </span>
                            </div>
                            <span>
                                {formatLocalDateLong(transfer.transacted_at)}.
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
