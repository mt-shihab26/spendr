import type { TCategory } from '@/types/models';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/components/screens/categories/category-form';
import { CategoryDeleteDialog } from '@/components/screens/categories/category-delete-dialog';

const CategoriesEdit = ({ category }: { category: TCategory }) => {
    return (
        <AppLayout
            title="Edit Category"
            description="Update category details"
            breadcrumbs={[
                {
                    title: 'Categories',
                    route: 'categories.index',
                },
                {
                    title: category.name,
                    route: 'categories.show',
                    params: { category: category.id },
                },
                {
                    title: 'Edit',
                    route: 'categories.edit',
                    params: { category: category.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Edit Category"
                        description="Update category details"
                    />
                    <BackButton href={route('categories.show', category.id)} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <CategoryForm category={category} />
                    {!category.is_default && (
                        <div className="mt-6 border-t pt-4">
                            <CategoryDeleteDialog
                                category={category}
                                trigger={
                                    <Button variant="destructive" size="sm">
                                        <Trash2 />
                                        Delete Category
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default CategoriesEdit;
