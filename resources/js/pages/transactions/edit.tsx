import type { TTransaction, TWallet, TCategory } from '@/types/models';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { TransactionForm } from '@/components/screens/transactions/transaction-form';
import { TransactionDeleteDialog } from '@/components/screens/transactions/transaction-delete-dialog';

const TransactionsEdit = ({
    transaction,
    wallets,
    categories,
}: {
    transaction: TTransaction;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    return (
        <AppLayout
            title="Edit Transaction"
            description="Update transaction details"
            breadcrumbs={[
                {
                    title: 'Transactions',
                    route: 'transactions.index',
                },
                {
                    title: transaction.description,
                    route: 'transactions.show',
                    params: { transaction: transaction.id },
                },
                {
                    title: 'Edit',
                    route: 'transactions.edit',
                    params: { transaction: transaction.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Edit Transaction"
                        description="Update transaction details"
                    />
                    <BackButton
                        href={route('transactions.show', transaction.id)}
                    />
                </div>
                <div className="mx-auto w-full max-w-lg space-y-4">
                    <div className="border p-4">
                        <TransactionForm
                            transaction={transaction}
                            wallets={wallets}
                            categories={categories}
                        />
                    </div>
                    <div className="border-t pt-4">
                        <TransactionDeleteDialog
                            transaction={transaction}
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete Transaction
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TransactionsEdit;
