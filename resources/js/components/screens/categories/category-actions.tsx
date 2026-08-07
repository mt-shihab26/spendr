import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TCategory } from '@/types/models';

export const CategoryActions = ({
    category,
    onDelete,
}: {
    category: TCategory;
    onDelete: (category: TCategory) => void;
}) => {
    return (
        <ActionsMenu>
            <ViewItem href={route('categories.show', category.id)} />
            <EditItem href={route('categories.edit', category.id)} />
            {!category.is_default && (
                <>
                    <ActionsMenuSeparator />
                    <DeleteItem onClick={() => onDelete(category)} />
                </>
            )}
        </ActionsMenu>
    );
};
