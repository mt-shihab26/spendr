import type { TTransfer } from '@/types/models';

import { Link } from '@inertiajs/react';
import { formatLocalDateTimeLong } from '@/lib/date';
import { formatCurrency } from '@/lib/formats';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { IconBadge } from '@/components/elements/icon-badge';

const TransfersShow = ({ transfer }: { transfer: TTransfer }) => {
    return (
        <AppLayout
            title="Transfer"
            description="Transfer details"
            breadcrumbs={[
                {
                    title: 'Transfers',
                    route: 'transfers.index',
                },
                {
                    title: 'Transfer',
                    route: 'transfers.show',
                    params: { transfer: transfer.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Transfer"
                        description={formatLocalDateTimeLong(
                            transfer.transacted_at,
                        )}
                    />
                    <div className="flex items-center">
                        <EditButton
                            href={route('transfers.edit', transfer.id)}
                        />
                        <BackButton href={route('transfers.index')} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="mt-1 text-lg font-semibold text-blue-600 tabular-nums">
                            {formatCurrency(
                                transfer.amount,
                                transfer.from_wallet?.currency,
                            )}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            From Wallet
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {transfer.from_wallet && (
                                <IconBadge
                                    icon={transfer.from_wallet.icon}
                                    color={transfer.from_wallet.color}
                                />
                            )}
                            {transfer.from_wallet ? (
                                <Link
                                    href={route(
                                        'wallets.show',
                                        transfer.from_wallet.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {transfer.from_wallet.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium">—</span>
                            )}
                        </div>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            To Wallet
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {transfer.to_wallet && (
                                <IconBadge
                                    icon={transfer.to_wallet.icon}
                                    color={transfer.to_wallet.color}
                                />
                            )}
                            {transfer.to_wallet ? (
                                <Link
                                    href={route(
                                        'wallets.show',
                                        transfer.to_wallet.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {transfer.to_wallet.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium">—</span>
                            )}
                        </div>
                    </div>
                </div>
                {transfer.notes && (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{transfer.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default TransfersShow;
