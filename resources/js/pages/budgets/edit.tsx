import type { TBudget, TCategory } from '@/types/models';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { BudgetForm } from '@/components/screens/budgets/budget-form';
import { BudgetDeleteDialog } from '@/components/screens/budgets/budget-delete-dialog';

const BudgetsEdit = ({
    budget,
    categories,
}: {
    budget: TBudget;
    categories: TCategory[];
}) => {
    return (
        <AppLayout
            title="Edit Budget"
            description="Update monthly spending limit"
            breadcrumbs={[
                {
                    title: 'Budgets',
                    route: 'budgets.index',
                },
                {
                    title: 'Budget',
                    route: 'budgets.show',
                    params: { budget: budget.id },
                },
                {
                    title: 'Edit',
                    route: 'budgets.edit',
                    params: { budget: budget.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Edit Budget"
                        description="Update monthly spending limit"
                    />
                    <BackButton href={route('budgets.show', budget.id)} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <BudgetForm budget={budget} categories={categories} />
                    <div className="mt-6 border-t pt-4">
                        <BudgetDeleteDialog
                            budget={budget}
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete Budget
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default BudgetsEdit;
