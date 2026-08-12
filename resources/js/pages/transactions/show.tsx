import type { TTransactionWithRelations } from '@/types/withs';

import { Link } from '@inertiajs/react';
import { formatLocalDateTimeLong } from '@/lib/date';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { FileAttachments } from '@/components/screens/transactions/file-attachments';

const TransactionsShow = ({
    transaction,
}: {
    transaction: TTransactionWithRelations;
}) => {
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
                        description={formatLocalDateTimeLong(
                            transaction.transacted_at,
                        )}
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
                            <IconBadge
                                icon={transaction.category.icon}
                                color={transaction.category.color}
                            />
                            <Link
                                href={route(
                                    'categories.show',
                                    transaction.category.id,
                                )}
                                className="text-sm font-medium hover:underline"
                            >
                                {transaction.category.name}
                            </Link>
                        </div>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <div className="mt-1 flex items-center gap-2">
                            <IconBadge
                                icon={transaction.wallet.icon}
                                color={transaction.wallet.color}
                            />
                            <Link
                                href={route(
                                    'wallets.show',
                                    transaction.wallet.id,
                                )}
                                className="text-sm font-medium hover:underline"
                            >
                                {transaction.wallet.name}
                            </Link>
                        </div>
                    </div>
                </div>
                {transaction.notes && (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{transaction.notes}</p>
                    </div>
                )}
                <FileAttachments transaction={transaction} readonly />
            </div>
        </AppLayout>
    );
};

export default TransactionsShow;
