import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTransfer } from '@/types/models';

export const TransferActions = ({
    transfer,
    onDelete,
}: {
    transfer: TTransfer;
    onDelete: (transfer: TTransfer) => void;
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
