import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TRecurringTransactionWithRelations } from '@/types/withs';

export const RecurringTransactionActions = ({
    recurring,
    onDelete,
}: {
    recurring: TRecurringTransactionWithRelations;
    onDelete: (recurring: TRecurringTransactionWithRelations) => void;
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
