import type { TRecurringTransaction } from '@/types/models';

import { useForm } from '@inertiajs/react';
import { formatCurrency } from '@/lib/formats';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (!confirm(`Delete "${recurring.description}"?`)) {
            return;
        }
        destroy(route('recurring-transactions.destroy', recurring.id));
    };

    return (
        <AppLayout
            title={recurring.description}
            description="Recurring transaction details"
            breadcrumbs={[
                {
                    title: 'Recurring',
                    route: 'recurring-transactions.index',
                },
                {
                    title: recurring.description,
                    route: 'recurring-transactions.show',
                    params: { recurringTransaction: recurring.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={recurring.description}
                        description={`${FREQUENCY_LABELS[recurring.frequency] ?? recurring.frequency} · Next due: ${recurring.next_due_at}`}
                    />
                    <div className="flex items-center gap-1">
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

                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="mt-1 text-lg font-semibold">
                            {recurring.wallet
                                ? formatCurrency(
                                      recurring.amount,
                                      recurring.wallet.currency,
                                  )
                                : recurring.amount.toFixed(2)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                            {recurring.type}
                        </Badge>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Frequency
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize">
                            {FREQUENCY_LABELS[recurring.frequency] ??
                                recurring.frequency}
                        </p>
                    </div>
                    <div className="border p-4">
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <div className="mt-1 flex items-center gap-2">
                            {recurring.wallet && (
                                <IconBadge
                                    icon={recurring.wallet.icon}
                                    color={recurring.wallet.color}
                                />
                            )}
                            <span className="text-sm font-medium">
                                {recurring.wallet?.name ?? '—'}
                            </span>
                        </div>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Category
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {recurring.category && (
                                <IconBadge
                                    icon={recurring.category.icon}
                                    color={recurring.category.color}
                                />
                            )}
                            <span className="text-sm font-medium">
                                {recurring.category?.name ?? '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {recurring.notes && (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{recurring.notes}</p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Next Due
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {recurring.next_due_at}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Last Run
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {recurring.last_run_at ?? 'Never'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
};

export default RecurringTransactionsShow;
