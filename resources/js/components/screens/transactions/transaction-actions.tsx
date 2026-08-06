import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTransaction } from '@/types/models';

export const TransactionActions = ({
    transaction,
    onDelete,
}: {
    transaction: TTransaction;
    onDelete: (transaction: TTransaction) => void;
}) => {
    return (
        <ActionsMenu>
            <ViewItem href={route('transactions.show', transaction.id)} />
            <EditItem href={route('transactions.edit', transaction.id)} />
            <ActionsMenuSeparator />
            <DeleteItem onClick={() => onDelete(transaction)} />
        </ActionsMenu>
    );
};
