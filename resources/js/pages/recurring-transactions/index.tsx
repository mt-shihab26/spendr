import type { TRecurringTransactionWithRelations } from '@/types/withs';

import { RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { EmptyState } from '@/components/elements/empty-state';
import { RecurringTransactionsTable } from '@/components/screens/recurring-transactions/recurring-transactions-table';

const RecurringTransactionsIndex = ({
    recurring,
}: {
    recurring: TRecurringTransactionWithRelations[];
}) => {
    const title = `Recurring Transactions (${recurring.length})`;

    return (
        <AppLayout
            title={title}
            description="Automated transactions on a schedule"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={title}
                        description="Automated transactions on a schedule"
                    />
                    <NewButton href={route('recurring-transactions.create')}>
                        New Recurring
                    </NewButton>
                </div>
                {recurring.length === 0 ? (
                    <EmptyState
                        icon={<RefreshCw />}
                        title="No recurring transactions"
                        description="Set up recurring income or expenses that automatically post on a schedule."
                        href={route('recurring-transactions.create')}
                        action="Create first recurring transaction"
                    />
                ) : (
                    <RecurringTransactionsTable recurring={recurring} />
                )}
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsIndex;
