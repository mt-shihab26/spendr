import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TBudget } from '@/types/models';

import { CircleDollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { BudgetsTable } from '@/components/screens/budgets/budgets-table';

const BudgetsIndex = ({ budgets }: { budgets: TBudget[] }) => {
    return (
        <AppLayout
            title="Budgets"
            description="Set monthly spending limits per category"
            breadcrumbs={[{ title: 'Budgets', route: 'budgets.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Budgets (${budgets.length})`}
                        description="Set monthly spending limits per category"
                    />
                    <NewButton href={route('budgets.create')}>
                        New Budget
                    </NewButton>
                </div>
                {budgets.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <CircleDollarSign />
                            </EmptyMedia>
                            <EmptyTitle>No budgets yet</EmptyTitle>
                            <EmptyDescription>
                                Set a monthly spending limit for each expense
                                category to track your progress.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('budgets.create')}>
                            Create first budget
                        </NewButton>
                    </Empty>
                ) : (
                    <BudgetsTable budgets={budgets} />
                )}
            </div>
        </AppLayout>
    );
};

export default BudgetsIndex;
