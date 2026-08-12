import type { TTransterWithWallets } from '@/types/withs';

import { formatCurrency } from '@/lib/formats';
import { formatLocalDateLong, formatLocalDateTime } from '@/lib/date';
import { getCurrencySymbol } from '@/lib/currency';

import { Link } from '@inertiajs/react';
import { CalendarDays, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { IconBadge } from '@/components/elements/icon-badge';

const WalletCard = ({ wallet }: { wallet: TTransterWithWallets['from_wallet'] }) => (
    <div className="flex items-center gap-3">
        <IconBadge icon={wallet.icon} color={wallet.color} />
        <div>
            <Link
                href={route('wallets.show', wallet.id)}
                className="text-sm font-medium hover:underline"
            >
                {wallet.name}
            </Link>
            <p className="text-xs text-muted-foreground">
                {getCurrencySymbol(wallet.currency)} {wallet.currency}
            </p>
        </div>
    </div>
);

const TransfersShow = ({ transfer }: { transfer: TTransterWithWallets }) => {
    const title = `Transfer #${transfer.id}`;

    return (
        <AppLayout
            title={title}
            description={formatLocalDateLong(transfer.transacted_at)}
            breadcrumbs={[
                { title: 'Transfers', route: 'transfers.index' },
                {
                    title,
                    route: 'transfers.show',
                    params: { transfer: transfer.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={title}
                        description={formatLocalDateLong(transfer.transacted_at)}
                    />
                    <div className="flex items-center gap-2">
                        <EditButton href={route('transfers.edit', transfer.id)} />
                        <BackButton href={route('transfers.index')} />
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">ID</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {transfer.id}
                        </p>
                    </div>
                    <div className="w-full border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="mt-1 text-lg font-bold tabular-nums text-blue-600">
                            {formatCurrency(transfer.amount, transfer.from_wallet.currency)}
                        </p>
                    </div>
                    <div className="w-full border p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3" />
                            Date
                        </div>
                        <p className="mt-1 text-sm font-medium">
                            {formatLocalDateTime(transfer.transacted_at)}
                        </p>
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <p className="mb-2 text-xs text-muted-foreground">From</p>
                        <WalletCard wallet={transfer.from_wallet} />
                    </div>
                    <div className="w-full border p-4">
                        <p className="mb-2 text-xs text-muted-foreground">To</p>
                        <WalletCard wallet={transfer.to_wallet} />
                    </div>
                </div>

                {transfer.notes && (
                    <div className="w-full border p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="size-3" />
                            Notes
                        </div>
                        <p className="mt-1 text-sm">{transfer.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default TransfersShow;
