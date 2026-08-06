import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type {
    TPaginated,
    TTransactionPeriod,
    TTransactionType,
} from '@/types/utils';

import type { TTransaction } from '@/types/models';
import type { TStat } from '@/components/elements/currency-stats';

import { router } from '@inertiajs/react';

import { InfiniteScroll } from '@inertiajs/react';
import { CurrencyStats } from '@/components/elements/currency-stats';
import { ArrowRightLeft } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TransactionsIndex = ({
    transactions,
    period,
    type,
    stats,
}: {
    transactions: TPaginated<TTransaction>;
    period: TTransactionPeriod;
    type: TTransactionType;
    stats: TStat[];
}) => {
    const navigate = (params: { period?: string; type?: string }) => {
        router.get(
            route('transactions.index'),
            { period, type, ...params },
            { preserveScroll: true, preserveState: false, replace: true },
        );
    };

    return (
        <AppLayout
            title="Transactions"
            description="Track your income and expenses"
            breadcrumbs={[
                { title: 'Transactions', route: 'transactions.index' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Transactions"
                        description="Track your income and expenses"
                    />
                    <NewButton href={route('transactions.create')}>
                        New Transaction
                    </NewButton>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Tabs
                        value={type}
                        onValueChange={(value) => navigate({ type: value })}
                    >
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="income">Income</TabsTrigger>
                            <TabsTrigger value="expense">Expense</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Tabs
                        value={period}
                        onValueChange={(value) => navigate({ period: value })}
                    >
                        <TabsList>
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="week">This Week</TabsTrigger>
                            <TabsTrigger value="month">This Month</TabsTrigger>
                            <TabsTrigger value="year">This Year</TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {stats.length > 0 && <CurrencyStats stats={stats} />}
                {transactions.data.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <ArrowRightLeft />
                            </EmptyMedia>
                            <EmptyTitle>No transactions yet</EmptyTitle>
                            <EmptyDescription>
                                Record your first income or expense to start
                                tracking your finances.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('transactions.create')}>
                            Record first transaction
                        </NewButton>
                    </Empty>
                ) : (
                    <InfiniteScroll data="transactions" onlyNext preserveUrl>
                        <TransactionsTable transactions={transactions.data} />
                    </InfiniteScroll>
                )}
            </div>
        </AppLayout>
    );
};

export default TransactionsIndex;
