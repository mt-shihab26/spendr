import type { TCategory } from '@/types/models';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formats';
import { CURRENCIES_OPTIONS } from '@/lib/currency';

import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { CategoryActions } from '@/components/screens/categories/category-actions';
import { CategoryDeleteDialog } from '@/components/screens/categories/category-delete-dialog';

const isOverBudget = (category: TCategory): boolean => {
    if (!category.budget) return false;
    return CURRENCIES_OPTIONS.some(
        (c) => (category.month_spent?.[c] ?? 0) > (category.budget!.amount[c] ?? 0),
    );
};

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
                        <Link
                            href={route('categories.show', category.id)}
                            className="flex-1 text-sm font-medium hover:underline"
                        >
                            {category.name}
                        </Link>
                        {category.is_default && (
                            <Badge variant="secondary">Default</Badge>
                        )}
                        {isOverBudget(category) && (
                            <Badge variant="destructive">⚠ Over</Badge>
                        )}
                        <div className="flex flex-col items-end gap-0.5">
                            {CURRENCIES_OPTIONS.map((currency) => {
                                const spent = category.month_spent?.[currency] ?? 0;
                                return (
                                    <span key={currency} className="text-xs tabular-nums text-muted-foreground">
                                        {formatCurrency(spent, currency)}{' '}
                                        <span className="text-muted-foreground/60">this mo</span>
                                    </span>
                                );
                            })}
                        </div>
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
