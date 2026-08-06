import type { TBudget } from '@/types/models';

import { formatCurrency } from '@/lib/formats';

import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { IconBadge } from '@/components/elements/icon-badge';

const BudgetsShow = ({ budget }: { budget: TBudget }) => {
    return (
        <AppLayout
            title="Budget"
            description="Budget details"
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
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Monthly Limit
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            {formatCurrency(budget.amount)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Category
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {budget.category && (
                                <IconBadge
                                    icon={budget.category.icon}
                                    color={budget.category.color}
                                />
                            )}
                            {budget.category ? (
                                <Link
                                    href={route(
                                        'categories.show',
                                        budget.category.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {budget.category.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium">—</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default BudgetsShow;
