import type { TWallet } from '@/types/models';
import type { ReactElement } from 'react';

import { router } from '@inertiajs/react';
import { DeleteDialog } from '@/components/elements/delete-dialog';

export const WalletDeleteDialog = ({
    wallet,
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    wallet: TWallet;
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
            title={`Delete "${wallet.name}" Wallet?`}
            description="This cannot be undone. Reassign or delete all transactions first."
            onConfirm={() =>
                router.delete(route('wallets.destroy', wallet.id), {
                    onSuccess: () => onDeleted?.(),
                })
            }
        />
    );
};
