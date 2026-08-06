import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    SetDefaultItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';

export const WalletActions = ({
    wallet,
    onDelete,
}: {
    wallet: TWallet;
    onDelete: (wallet: TWallet) => void;
}) => {
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
            <DeleteItem onClick={() => onDelete(wallet)} />
        </ActionsMenu>
    );
};
