import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TRecurringTransaction } from '@/types/models';

export const RecurringTransactionActions = ({
    recurring,
    onDelete,
}: {
    recurring: TRecurringTransaction;
    onDelete: (recurring: TRecurringTransaction) => void;
}) => {
    return (
        <ActionsMenu>
            <ViewItem
                href={route('recurring-transactions.show', recurring.id)}
            />
            <EditItem
                href={route('recurring-transactions.edit', recurring.id)}
            />
            <ActionsMenuSeparator />
            <DeleteItem onClick={() => onDelete(recurring)} />
        </ActionsMenu>
    );
};
