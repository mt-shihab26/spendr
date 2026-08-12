import type { TRecurringTransaction } from '@/types/models';

import { formatCurrency } from '@/lib/formats';
import { formatLocalDateLong } from '@/lib/date';

import { Link } from '@inertiajs/react';
import { CalendarDays, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';

const FREQUENCY_LABELS: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
};

const RecurringTransactionsShow = ({
    recurring,
}: {
    recurring: TRecurringTransaction;
}) => {
    const title = `Recurring #${recurring.id}`;

    return (
        <AppLayout
            title={title}
            description={recurring.description}
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
                {
                    title: recurring.id,
                    route: 'recurring-transactions.show',
                    params: { recurringTransaction: recurring.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading title={title} description={recurring.description} />
                    <div className="flex items-center gap-2">
                        <EditButton
                            href={route(
                                'recurring-transactions.edit',
                                recurring.id,
                            )}
                        />
                        <BackButton
                            href={route('recurring-transactions.index')}
                        />
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">ID</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {recurring.id}
                        </p>
                    </div>
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="mt-1 text-lg font-bold text-blue-600 tabular-nums">
                            {recurring.wallet
                                ? formatCurrency(
                                      recurring.amount,
                                      recurring.wallet.currency,
                                  )
                                : recurring.amount.toFixed(2)}
                        </p>
                    </div>
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                            {recurring.type}
                        </Badge>
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">
                            Frequency
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize">
                            {FREQUENCY_LABELS[recurring.frequency] ??
                                recurring.frequency}
                        </p>
                    </div>
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge
                            variant={
                                recurring.is_active ? 'secondary' : 'outline'
                            }
                            className="mt-1"
                        >
                            {recurring.is_active ? 'Active' : 'Paused'}
                        </Badge>
                    </div>
                    <div className="w-full border p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3" />
                            Next Due
                        </div>
                        <p className="mt-1 text-sm font-medium">
                            {formatLocalDateLong(recurring.next_due_at)}
                        </p>
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <p className="mb-2 text-xs text-muted-foreground">
                            Wallet
                        </p>
                        {recurring.wallet ? (
                            <div className="flex items-center gap-2">
                                <IconBadge
                                    icon={recurring.wallet.icon}
                                    color={recurring.wallet.color}
                                />
                                <Link
                                    href={route(
                                        'wallets.show',
                                        recurring.wallet.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {recurring.wallet.name}
                                </Link>
                            </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                —
                            </span>
                        )}
                    </div>
                    <div className="w-full border p-4">
                        <p className="mb-2 text-xs text-muted-foreground">
                            Category
                        </p>
                        {recurring.category ? (
                            <div className="flex items-center gap-2">
                                <IconBadge
                                    icon={recurring.category.icon}
                                    color={recurring.category.color}
                                />
                                <span className="text-sm font-medium">
                                    {recurring.category.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                —
                            </span>
                        )}
                    </div>
                </div>

                {recurring.notes && (
                    <div className="w-full border p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="size-3" />
                            Notes
                        </div>
                        <p className="mt-1 text-sm">{recurring.notes}</p>
                    </div>
                )}

                {recurring.last_run_at && (
                    <div className="w-full border p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3" />
                            Last Run
                        </div>
                        <p className="mt-1 text-sm font-medium">
                            {formatLocalDateLong(recurring.last_run_at)}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsShow;
