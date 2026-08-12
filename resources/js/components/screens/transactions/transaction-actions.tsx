import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTransactionListItem } from '@/types/withs';

export const TransactionActions = ({
    transaction,
    onDelete,
}: {
    transaction: TTransactionListItem;
    onDelete: (transaction: TTransactionListItem) => void;
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
