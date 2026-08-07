import type { TCategory, TWallet } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { RecurringTransactionForm } from '@/components/screens/recurring-transactions/recurring-transaction-form';

const RecurringTransactionsCreate = ({
    wallets,
    categories,
}: {
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    return (
        <AppLayout
            title="New Recurring Transaction"
            description="Set up a scheduled transaction"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
                {
                    title: 'New',
                    route: 'recurring-transactions.create',
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Recurring Transaction"
                        description="Set up a transaction that posts automatically on a schedule"
                    />
                    <BackButton
                        href={route('recurring-transactions.index')}
                    />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <RecurringTransactionForm
                        wallets={wallets}
                        categories={categories}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsCreate;
