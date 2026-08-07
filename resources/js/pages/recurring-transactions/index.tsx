import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TRecurringTransaction } from '@/types/models';

import { RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/formats';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { Link } from '@inertiajs/react';
import { EditButton } from '@/components/elements/edit-button';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionAmount } from '@/components/elements/transaction-amount';

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
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <RefreshCw />
                            </EmptyMedia>
                            <EmptyTitle>No recurring transactions</EmptyTitle>
                            <EmptyDescription>
                                Set up recurring income or expenses that
                                automatically post on a schedule.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton
                            href={route('recurring-transactions.create')}
                        >
                            Create first recurring transaction
                        </NewButton>
                    </Empty>
                ) : (
                    <div className="border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                                    <th className="px-3 py-2 text-left font-medium">
                                        Description
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
                                    <th className="w-10 px-3 py-2" />
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
                                                    {r.description}
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
                                        <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                                            {r.next_due_at}
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
                                            <EditButton
                                                href={route(
                                                    'recurring-transactions.edit',
                                                    r.id,
                                                )}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsIndex;
