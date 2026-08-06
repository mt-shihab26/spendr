import type { TCategory } from '@/types/models';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { CategoryActions } from '@/components/screens/categories/category-actions';
import { CategoryDeleteDialog } from '@/components/screens/categories/category-delete-dialog';

export const CategoriesTable = ({
    categories,
}: {
    categories: TCategory[];
}) => {
    const [categoryToDelete, setCategoryToDelete] = useState<TCategory | null>(
        null,
    );

    return (
        <>
            <div className="divide-y border">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <IconBadge
                            icon={category.icon}
                            color={category.color}
                        />
                        <span className="flex-1 text-xs font-medium">
                            {category.name}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                            {category.type}
                        </Badge>
                        {category.is_default && (
                            <Badge variant="secondary">Default</Badge>
                        )}
                        <CategoryActions
                            category={category}
                            onDelete={setCategoryToDelete}
                        />
                    </div>
                ))}
            </div>
            {categoryToDelete && (
                <CategoryDeleteDialog
                    category={categoryToDelete}
                    open={!!categoryToDelete}
                    onDeleted={() => setCategoryToDelete(null)}
                    onOpenChange={(open) => !open && setCategoryToDelete(null)}
                />
            )}
        </>
    );
};
