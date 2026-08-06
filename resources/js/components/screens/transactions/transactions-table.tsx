import type { TTransaction } from '@/types/models';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionActions } from '@/components/screens/transactions/transaction-actions';
import { TransactionDeleteDialog } from '@/components/screens/transactions/transaction-delete-dialog';

export const TransactionsTable = ({
    transactions,
}: {
    transactions: TTransaction[];
}) => {
    const [toDelete, setToDelete] = useState<TTransaction | null>(null);

    return (
        <>
            <div className="divide-y border">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <IconBadge
                            icon={transaction.category?.icon ?? null}
                            color={transaction.category?.color ?? '#6366f1'}
                        />
                        <div className="flex flex-1 flex-col">
                            <span className="text-xs font-medium">
                                {transaction.description}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {transaction.category?.name} ·{' '}
                                {transaction.wallet?.name}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {transaction.transacted_at}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                            {transaction.type}
                        </Badge>
                        <TransactionAmount
                            transaction={transaction}
                            className="text-xs font-semibold"
                        />
                        <TransactionActions
                            transaction={transaction}
                            onDelete={setToDelete}
                        />
                    </div>
                ))}
            </div>
            {toDelete && (
                <TransactionDeleteDialog
                    transaction={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </>
    );
};
