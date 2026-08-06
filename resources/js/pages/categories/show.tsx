import type { TCategory, TTransaction } from '@/types/models';
import type { TPaginated } from '@/types/utils';

import { getIcon } from '@/lib/icons';

import { InfiniteScroll } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';

const CategoriesShow = ({
    category,
    transactions,
}: {
    category: TCategory;
    transactions: TPaginated<TTransaction>;
}) => {
    return (
        <AppLayout
            title={category.name}
            description={category.name}
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
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={category.name}
                        description={
                            category.is_default
                                ? `${category.type} · Default category`
                                : category.type
                        }
                        icon={getIcon(category.icon)}
                        color={category.color}
                    />
                    <div className="flex items-center">
                        <EditButton
                            href={route('categories.edit', category.id)}
                        />
                        <BackButton href={route('categories.index')} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Transactions</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            {category.transactions_count ?? 0}
                        </p>
                    </div>
                    {category.budget ? (
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <Link
                                href={route('budgets.show', category.budget.id)}
                                className="mt-1 text-sm font-medium hover:underline"
                            >
                                View budget →
                            </Link>
                        </div>
                    ) : category.type === 'expense' ? (
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <Link
                                href={route('budgets.create')}
                                className="mt-1 text-sm font-medium hover:underline"
                            >
                                Set a budget →
                            </Link>
                        </div>
                    ) : null}
                </div>
                {transactions.data.length > 0 ? (
                    <InfiniteScroll data="transactions" onlyNext preserveUrl>
                        <TransactionsTable transactions={transactions.data} />
                    </InfiniteScroll>
                ) : (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            No transactions yet.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default CategoriesShow;
