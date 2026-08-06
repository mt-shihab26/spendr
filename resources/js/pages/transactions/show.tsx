import type { TTransaction } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';

const TransactionsShow = ({ transaction }: { transaction: TTransaction }) => {
    return (
        <AppLayout
            title={transaction.description}
            description={transaction.description}
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
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={transaction.description}
                        description={transaction.transacted_at}
                    />
                    <div className="flex items-center">
                        <EditButton
                            href={route('transactions.edit', transaction.id)}
                        />
                        <BackButton href={route('transactions.index')} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <TransactionAmount
                            transaction={transaction}
                            className="mt-1 text-lg font-semibold"
                        />
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                            {transaction.type}
                        </Badge>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Category
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {transaction.category && (
                                <IconBadge
                                    icon={transaction.category.icon}
                                    color={transaction.category.color}
                                />
                            )}
                            <span className="text-sm font-medium">
                                {transaction.category?.name ?? '—'}
                            </span>
                        </div>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <p className="mt-1 text-sm font-medium">
                            {transaction.wallet?.name ?? '—'}
                        </p>
                    </div>
                </div>
                {transaction.notes && (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{transaction.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default TransactionsShow;
