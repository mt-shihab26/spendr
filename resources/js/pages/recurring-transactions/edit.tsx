import type { TCategory, TRecurringTransaction, TWallet } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { RecurringTransactionForm } from '@/components/screens/recurring-transactions/recurring-transaction-form';

const RecurringTransactionsEdit = ({
    recurring,
    wallets,
    categories,
}: {
    recurring: TRecurringTransaction;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    return (
        <AppLayout
            title={`Edit: ${recurring.description}`}
            description="Update recurring transaction"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
                {
                    title: recurring.description,
                    route: 'recurring-transactions.show',
                    params: { recurringTransaction: recurring.id },
                },
                {
                    title: 'Edit',
                    route: 'recurring-transactions.edit',
                    params: { recurringTransaction: recurring.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Edit: ${recurring.description}`}
                        description="Update this recurring transaction"
                    />
                    <BackButton
                        href={route(
                            'recurring-transactions.show',
                            recurring.id,
                        )}
                    />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <RecurringTransactionForm
                        recurring={recurring}
                        wallets={wallets}
                        categories={categories}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsEdit;
