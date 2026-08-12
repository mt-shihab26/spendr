import type { TRecurringTransactionWithRelations } from '@/types/withs';

import { useState } from 'react';
import { formatLocalDateLong } from '@/lib/date';
import { getFrequency } from '@/lib/options';

import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { RecurringTransactionActions } from '@/components/screens/recurring-transactions/recurring-transaction-actions';
import { RecurringTransactionDeleteDialog } from '@/components/screens/recurring-transactions/recurring-transaction-delete-dialog';

export const RecurringTransactionsTable = ({
    recurring,
}: {
    recurring: TRecurringTransactionWithRelations[];
}) => {
    const [toDelete, setToDelete] =
        useState<TRecurringTransactionWithRelations | null>(null);

    return (
        <>
            <div className="border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                            <th className="px-3 py-2 text-left font-medium">
                                Name
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Wallet
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Frequency
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Next Due
                            </th>
                            <th className="px-3 py-2 text-right font-medium">
                                Amount
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                                Status
                            </th>
                            <th className="w-8 px-3 py-2" />
                            <th className="w-8 px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {recurring.map((r) => (
                            <tr
                                key={r.id}
                                className="border-b last:border-0 hover:bg-muted/20"
                            >
                                <td className="px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        {r.category && (
                                            <IconBadge
                                                icon={r.category.icon}
                                                color={r.category.color}
                                                size="sm"
                                            />
                                        )}
                                        <Link
                                            href={route(
                                                'recurring-transactions.show',
                                                r.id,
                                            )}
                                            className="font-medium hover:underline"
                                        >
                                            {r.name}
                                        </Link>
                                    </div>
                                </td>
                                <td className="px-3 py-2.5 text-muted-foreground">
                                    {r.wallet?.name ?? '—'}
                                </td>
                                <td className="px-3 py-2.5 capitalize">
                                    {getFrequency(r.frequency)?.label ??
                                        r.frequency}
                                </td>
                                <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                                    {formatLocalDateLong(r.next_due_at)}
                                </td>
                                <td className="px-3 py-2.5 text-right tabular-nums">
                                    <TransactionAmount
                                        transaction={r as never}
                                    />
                                </td>
                                <td className="px-3 py-2.5">
                                    <Badge
                                        variant={
                                            r.is_active ? 'secondary' : 'outline'
                                        }
                                        className="text-xs"
                                    >
                                        {r.is_active ? 'Active' : 'Paused'}
                                    </Badge>
                                </td>
                                <td className="px-3 py-2.5">
                                    <RecurringTransactionActions
                                        recurring={r}
                                        onDelete={setToDelete}
                                    />
                                </td>
                                <td className="px-3 py-2.5">
                                    <Link
                                        href={route(
                                            'recurring-transactions.show',
                                            r.id,
                                        )}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {toDelete && (
                <RecurringTransactionDeleteDialog
                    recurring={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </>
    );
};
