import type { TTransaction } from '@/types/models';

import { useState } from 'react';
import { formatLocalDateLong, formatLocalDateTime } from '@/lib/date';

import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

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

    const transactionsByDate = transactions.reduce<Map<string, TTransaction[]>>(
        (groups, transaction) => {
            const transactionsForDate =
                groups.get(transaction.transacted_at) ?? [];

            transactionsForDate.push(transaction);
            groups.set(transaction.transacted_at, transactionsForDate);

            return groups;
        },
        new Map(),
    );

    return (
        <>
            <div className="divide-y border">
                {Array.from(transactionsByDate.entries()).map(
                    ([date, groupedTransactions]) => (
                        <div key={date}>
                            <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                                {formatLocalDateLong(date)}
                            </div>
                            <div className="divide-y">
                                {groupedTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        <IconBadge
                                            icon={transaction.category?.icon}
                                            color={transaction.category?.color}
                                        />
                                        <div className="flex flex-1 flex-col">
                                            <Link
                                                href={route(
                                                    'transactions.show',
                                                    transaction.id,
                                                )}
                                                className="text-xs font-medium hover:underline"
                                            >
                                                {transaction.description}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {transaction.category ? (
                                                    <Link
                                                        href={route(
                                                            'categories.show',
                                                            transaction.category
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transaction.category
                                                                .name
                                                        }
                                                    </Link>
                                                ) : null}
                                                {' · '}
                                                {transaction.wallet && (
                                                    <Link
                                                        href={route(
                                                            'wallets.show',
                                                            transaction.wallet
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transaction.wallet
                                                                .name
                                                        }
                                                    </Link>
                                                )}
                                            </span>
                                            {transaction.notes && (
                                                <span className="text-xs text-muted-foreground/70 italic">
                                                    {transaction.notes}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatLocalDateTime(
                                                transaction.transacted_at,
                                            )}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
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
                                        <Link
                                            href={route('transactions.edit', transaction.id)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                )}
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
