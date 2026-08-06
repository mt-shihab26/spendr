import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TTransaction } from '@/types/models';

import { ArrowRightLeft } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';

const TransactionsIndex = ({
    transactions,
}: {
    transactions: TTransaction[];
}) => {
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
