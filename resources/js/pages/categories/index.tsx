import type { TCategory } from '@/types/models';
import type { TType } from '@/types/enums';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesTable } from '@/components/screens/categories/categories-table';
import { EmptyState } from '@/components/elements/empty-state';

const CategoriesIndex = ({ categories }: { categories: TCategory[] }) => {
    const [type, setType] = useState<TType>('expense');

    const filtered = categories.filter((c) => c.type === type);

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

                <Tabs value={type} onValueChange={(v) => setType(v as TType)}>
                    <TabsList>
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                    </TabsList>
                </Tabs>

                {filtered.length === 0 ? (
                    <EmptyState
                        icon={<Tag />}
                        title={`No ${type} categories yet`}
                        description={`Create your first ${type} category to start organising your transactions.`}
                        href={route('categories.create')}
                        action="Create your first category"
                    />
                ) : (
                    <CategoriesTable categories={filtered} />
                )}
            </div>
        </AppLayout>
    );
};

export default CategoriesIndex;
