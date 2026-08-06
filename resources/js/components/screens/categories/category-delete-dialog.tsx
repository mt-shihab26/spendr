import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { TCategory } from '@/types/models';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/elements/category-select';

export const CategoryDeleteDialog = ({
    category,
    categories = [],
    open,
    onOpenChange,
    onDeleted,
    trigger,
}: {
    category: TCategory;
    categories?: TCategory[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDeleted?: () => void;
    trigger?: ReactElement;
}) => {
    const [replacementId, setReplacementId] = useState<string | null>(null);
    const hasTransactions = (category.transactions_count ?? 0) > 0;
    const replacementCandidates = categories.filter((c) => c.id !== category.id);

    const handleDelete = () => {
        router.delete(route('categories.destroy', category.id), {
            data: hasTransactions ? { replacement_id: replacementId } : {},
            onSuccess: () => onDeleted?.(),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger render={trigger} />}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete "{category.name}"?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {hasTransactions ? (
                            <>
                                {category.transactions_count} transaction
                                {category.transactions_count !== 1 ? 's' : ''}{' '}
                                reference this category. Reassign them to:
                            </>
                        ) : (
                            'This cannot be undone.'
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {hasTransactions && (
                    <CategorySelect
                        categories={replacementCandidates}
                        type={category.type}
                        value={replacementId}
                        onValueChange={setReplacementId}
                    />
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={hasTransactions && !replacementId}
                        onClick={handleDelete}
                    >
                        {hasTransactions ? 'Reassign & Delete' : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
