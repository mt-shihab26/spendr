import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TTransactionPeriod } from '@/types/utils';
import type { TTransaction } from '@/types/models';

import { router } from '@inertiajs/react';
import { formatCurrency } from '@/lib/formats';

import { ArrowRightLeft } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TransactionsIndex = ({
    transactions,
    period,
    stats,
}: {
    transactions: TTransaction[];
    period: TTransactionPeriod;
    stats: { income: number; expense: number };
}) => {
    const changePeriod = (value: TTransactionPeriod) => {
        if (value === period) {
            return;
        }

        router.get(
            route('transactions.index'),
            {
                period: value,
            },
            {
                preserveScroll: true,
                preserveState: false,
                replace: true,
            },
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
                <div className="flex items-center justify-between gap-4">
                    <Tabs
                        value={period}
                        onValueChange={(value) => {
                            changePeriod(value);
                        }}
                    >
                        <TabsList>
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="week">This Week</TabsTrigger>
                            <TabsTrigger value="month">This Month</TabsTrigger>
                            <TabsTrigger value="year">This Year</TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-green-600">
                            +{formatCurrency(stats.income)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-medium text-red-500">
                            -{formatCurrency(stats.expense)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span
                            className={`font-medium ${stats.income - stats.expense >= 0 ? 'text-green-600' : 'text-red-500'}`}
                        >
                            {formatCurrency(stats.income - stats.expense)}
                        </span>
                    </div>
                </div>
                {transactions.length === 0 ? (
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
                    <TransactionsTable transactions={transactions} />
                )}
            </div>
        </AppLayout>
    );
};

export default TransactionsIndex;
