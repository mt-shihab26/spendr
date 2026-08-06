import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TCategory } from '@/types/models';

import { Tag } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { CategoriesTable } from '@/components/screens/categories/categories-table';

const CategoriesIndex = ({ categories }: { categories: TCategory[] }) => {
    return (
        <AppLayout
            title="Categories"
            description="Manage your income and expense categories"
            breadcrumbs={[{ title: 'Categories', route: 'categories.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Categories"
                        description="Manage your income and expense categories"
                    />
                    <NewButton href={route('categories.create')}>
                        New Category
                    </NewButton>
                </div>
                {categories.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <Tag />
                            </EmptyMedia>
                            <EmptyTitle>No categories yet</EmptyTitle>
                            <EmptyDescription>
                                Create your first category to start organising
                                your transactions.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('categories.create')}>
                            Create your first category
                        </NewButton>
                    </Empty>
                ) : (
                    <CategoriesTable categories={categories} />
                )}
            </div>
        </AppLayout>
    );
};

export default CategoriesIndex;
