import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    SetDefaultItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';

export const WalletActions = ({
    wallet,
    onDelete,
}: {
    wallet: TWallet;
    onDelete: (wallet: TWallet) => void;
}) => {
    const hasTransactions = (wallet.transactions_count ?? 0) > 0;

    return (
        <ActionsMenu>
            <ViewItem href={route('wallets.show', wallet.id)} />
            <EditItem href={route('wallets.edit', wallet.id)} />
            {!wallet.is_default && (
                <SetDefaultItem
                    onClick={() =>
                        router.patch(route('wallets.update', wallet.id), {
                            is_default: true,
                        })
                    }
                />
            )}
            <ActionsMenuSeparator />
            {hasTransactions ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="w-full">
                            <DeleteItem onClick={() => {}} disabled />
                        </TooltipTrigger>
                        <TooltipContent>
                            Reassign or delete all transactions first.
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <DeleteItem onClick={() => onDelete(wallet)} />
            )}
        </ActionsMenu>
    );
};
