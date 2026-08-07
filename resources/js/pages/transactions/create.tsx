import type { TWallet, TCategory } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { TransactionForm } from '@/components/screens/transactions/transaction-form';

const TransactionsCreate = ({
    wallets,
    categories,
}: {
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    return (
        <AppLayout
            title="New Transaction"
            description="Record an income or expense"
            breadcrumbs={[
                { title: 'Transactions', route: 'transactions.index' },
                { title: 'New Transaction', route: 'transactions.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Transaction"
                        description="Record an income or expense"
                    />
                    <BackButton href={route('transactions.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <TransactionForm
                        wallets={wallets}
                        categories={categories}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default TransactionsCreate;
