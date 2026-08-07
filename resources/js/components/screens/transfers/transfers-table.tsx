import type { TTransfer } from '@/types/models';

import { useState } from 'react';
import { formatLocalDateLong, formatLocalDateTime } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';

import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransferActions } from '@/components/screens/transfers/transfer-actions';
import { TransferDeleteDialog } from '@/components/screens/transfers/transfer-delete-dialog';

export const TransfersTable = ({ transfers }: { transfers: TTransfer[] }) => {
    const [toDelete, setToDelete] = useState<TTransfer | null>(null);

    const transfersByDate = transfers.reduce<Map<string, TTransfer[]>>(
        (groups, transfer) => {
            const transfersForDate = groups.get(transfer.transacted_at) ?? [];

            transfersForDate.push(transfer);
            groups.set(transfer.transacted_at, transfersForDate);

            return groups;
        },
        new Map(),
    );

    return (
        <>
            <div className="divide-y border">
                {Array.from(transfersByDate.entries()).map(
                    ([date, groupedTransfers]) => (
                        <div key={date}>
                            <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                                {formatLocalDateLong(date)}
                            </div>
                            <div className="divide-y">
                                {groupedTransfers.map((transfer) => (
                                    <div
                                        key={transfer.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-1">
                                            <IconBadge
                                                icon={
                                                    transfer.from_wallet?.icon
                                                }
                                                color={
                                                    transfer.from_wallet?.color
                                                }
                                            />
                                            <ArrowRight className="size-3 text-muted-foreground" />
                                            <IconBadge
                                                icon={transfer.to_wallet?.icon}
                                                color={
                                                    transfer.to_wallet?.color
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex items-center gap-1 text-xs font-medium">
                                                {transfer.from_wallet ? (
                                                    <Link
                                                        href={route(
                                                            'wallets.show',
                                                            transfer.from_wallet
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transfer.from_wallet
                                                                .name
                                                        }
                                                    </Link>
                                                ) : (
                                                    <span>—</span>
                                                )}
                                                <ArrowRight className="size-3 text-muted-foreground" />
                                                {transfer.to_wallet ? (
                                                    <Link
                                                        href={route(
                                                            'wallets.show',
                                                            transfer.to_wallet
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transfer.to_wallet
                                                                .name
                                                        }
                                                    </Link>
                                                ) : (
                                                    <span>—</span>
                                                )}
                                            </div>
                                            {transfer.notes && (
                                                <span className="text-xs text-muted-foreground/70 italic">
                                                    {transfer.notes}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatLocalDateTime(
                                                transfer.transacted_at,
                                            )}
                                        </span>
                                        <span className="text-xs font-semibold text-blue-600 tabular-nums">
                                            {formatCurrency(
                                                transfer.amount,
                                                transfer.from_wallet?.currency,
                                            )}
                                        </span>
                                        <TransferActions
                                            transfer={transfer}
                                            onDelete={setToDelete}
                                        />
                                        <Link
                                            href={route(
                                                'transfers.edit',
                                                transfer.id,
                                            )}
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
                <TransferDeleteDialog
                    transfer={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </>
    );
};
