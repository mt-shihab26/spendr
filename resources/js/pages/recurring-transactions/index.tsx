import type { TRecurringTransaction } from '@/types/models';

import { useState } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { formatLocalDateLong } from '@/lib/date';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { EmptyState } from '@/components/elements/empty-state';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { RecurringTransactionActions } from '@/components/screens/recurring-transactions/recurring-transaction-actions';
import { RecurringTransactionDeleteDialog } from '@/components/screens/recurring-transactions/recurring-transaction-delete-dialog';

const FREQUENCY_LABELS: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
};

const RecurringTransactionsIndex = ({
    recurring,
}: {
    recurring: TRecurringTransaction[];
}) => {
    const [toDelete, setToDelete] = useState<TRecurringTransaction | null>(
        null,
    );

    return (
        <AppLayout
            title="Recurring Transactions"
            description="Automated transactions on a schedule"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Recurring Transactions (${recurring.length})`}
                        description="Automated transactions on a schedule"
                    />
                    <NewButton href={route('recurring-transactions.create')}>
                        New Recurring
                    </NewButton>
                </div>

                {recurring.length === 0 ? (
                    <EmptyState
                        icon={<RefreshCw />}
                        title="No recurring transactions"
                        description="Set up recurring income or expenses that automatically post on a schedule."
                        href={route('recurring-transactions.create')}
                        action="Create first recurring transaction"
                    />
                ) : (
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
                                            {FREQUENCY_LABELS[r.frequency] ??
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
                                                    r.is_active
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className="text-xs"
                                            >
                                                {r.is_active
                                                    ? 'Active'
                                                    : 'Paused'}
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
                )}
            </div>
            {toDelete && (
                <RecurringTransactionDeleteDialog
                    recurring={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </AppLayout>
    );
};

export default RecurringTransactionsIndex;
