import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTransterWithRelations } from '@/types/withs';

export const TransferActions = ({
    transfer,
    onDelete,
}: {
    transfer: TTransterWithRelations;
    onDelete: (transfer: TTransterWithRelations) => void;
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
