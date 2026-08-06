import type { TCategory } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { BudgetForm } from '@/components/screens/budgets/budget-form';

const BudgetsCreate = ({ categories }: { categories: TCategory[] }) => {
    return (
        <AppLayout
            title="New Budget"
            description="Set a monthly spending limit"
            breadcrumbs={[
                { title: 'Budgets', route: 'budgets.index' },
                { title: 'New Budget', route: 'budgets.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Budget"
                        description="Set a monthly spending limit for a category"
                    />
                    <BackButton href={route('budgets.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <BudgetForm categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
};

export default BudgetsCreate;
