import type { TBudget } from '@/types/models';

import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { IconBadge } from '@/components/elements/icon-badge';
import { MonthPicker } from '@/components/elements/month-picker';
import { BudgetProgress } from '@/components/screens/budgets/budget-progress';

const BudgetsShow = ({
    budget,
    month,
}: {
    budget: TBudget;
    month: string;
}) => {
    return (
        <AppLayout
            title={budget.category?.name ?? 'Budget'}
            description="Monthly spending limit"
            breadcrumbs={[
                {
                    title: 'Budgets',
                    route: 'budgets.index',
                },
                {
                    title: budget.category?.name ?? 'Budget',
                    route: 'budgets.show',
                    params: { budget: budget.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={budget.category?.name ?? 'Budget'}
                        description="Monthly spending limit"
                    />
                    <div className="flex items-center">
                        <EditButton href={route('budgets.edit', budget.id)} />
                        <BackButton href={route('budgets.index')} />
                    </div>
                </div>

                <MonthPicker month={month} href={route('budgets.show', budget.id)} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Category</p>
                        <div className="mt-1 flex items-center gap-2">
                            {budget.category && (
                                <IconBadge
                                    icon={budget.category.icon}
                                    color={budget.category.color}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                {budget.category ? (
                                    <Link
                                        href={route('categories.show', budget.category.id)}
                                        className="text-sm font-medium hover:underline"
                                    >
                                        {budget.category.name}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium">—</span>
                                )}
                                {budget.category?.type && (
                                    <span className="text-xs capitalize text-muted-foreground">
                                        {budget.category.type}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border p-4">
                        <p className="mb-3 text-xs text-muted-foreground">Progress</p>
                        <BudgetProgress amount={budget.amount} spent={budget.spent} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default BudgetsShow;
