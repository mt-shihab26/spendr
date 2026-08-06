import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TBudget } from '@/types/models';

export const BudgetActions = ({
    budget,
    onDelete,
}: {
    budget: TBudget;
    onDelete: (budget: TBudget) => void;
}) => {
    return (
        <ActionsMenu>
            <ViewItem href={route('budgets.show', budget.id)} />
            <EditItem href={route('budgets.edit', budget.id)} />
            <ActionsMenuSeparator />
            <DeleteItem onClick={() => onDelete(budget)} />
        </ActionsMenu>
    );
};
