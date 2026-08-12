import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTableTranster } from '@/types/transfers';

export const TransferActions = ({
    transfer,
    onDelete,
}: {
    transfer: TTableTranster;
    onDelete: (transfer: TTableTranster) => void;
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
