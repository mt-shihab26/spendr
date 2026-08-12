import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTransterWithWallets } from '@/types/withs';

export const TransferActions = ({
    transfer,
    onDelete,
}: {
    transfer: TTransterWithWallets;
    onDelete: (transfer: TTransterWithWallets) => void;
}) => {
    return (
        <ActionsMenu>
            <ViewItem href={route('transfers.show', transfer.id)} />
            <EditItem href={route('transfers.edit', transfer.id)} />
            <ActionsMenuSeparator />
            <DeleteItem onClick={() => onDelete(transfer)} />
        </ActionsMenu>
    );
};
