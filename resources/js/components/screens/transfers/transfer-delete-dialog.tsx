import type { ReactElement } from 'react';
import type { TTransterWithRelations } from '@/types/withs';

import { router } from '@inertiajs/react';
import { formatLocalDateLong } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';
import { DeleteDialog } from '@/components/elements/delete-dialog';

import { ArrowRight } from 'lucide-react';

export const TransferDeleteDialog = ({
    transfer,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    transfer: TTransterWithRelations;
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
            title="Delete transfer?"
            description={
                <>
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">
                            {transfer.from_wallet.name}
                        </span>
                        <ArrowRight className="size-3" />
                        <span className="font-medium text-foreground">
                            {transfer.to_wallet.name}
                        </span>
                        <span>
                            {formatCurrency(
                                transfer.amount,
                                transfer.from_wallet?.currency,
                            )}
                        </span>
                    </div>
                    <span>
                        {formatLocalDateLong(transfer.transacted_at)}. Cannot be
                        undone.
                    </span>
                </>
            }
            onConfirm={() =>
                router.delete(route('transfers.destroy', transfer.id), {
                    onSuccess: () => onDeleted?.(),
                })
            }
        />
    );
};
