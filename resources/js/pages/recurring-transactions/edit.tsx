import type { TCategory, TRecurringTransaction, TWallet } from '@/types/models';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { RecurringTransactionForm } from '@/components/screens/recurring-transactions/recurring-transaction-form';
import { RecurringTransactionDeleteDialog } from '@/components/screens/recurring-transactions/recurring-transaction-delete-dialog';

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
            title={`Edit: ${recurring.name}`}
            description="Update recurring transaction"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
                {
                    title: recurring.name,
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
                        title="Edit Recurring"
                        description={`Recurring #${recurring.id}`}
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
                    <div className="mt-6 border-t pt-4">
                        <RecurringTransactionDeleteDialog
                            recurring={recurring}
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete Recurring
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsEdit;
