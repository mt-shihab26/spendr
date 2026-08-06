import type { TWallet } from '@/types/models';

import { formatCurrency } from '@/lib/formats';
import { getCurrencySymbol } from '@/lib/currency';
import { getIcon } from '@/lib/icons';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';

const WalletsShow = ({ wallet }: { wallet: TWallet }) => {
    return (
        <AppLayout
            title={wallet.name}
            description={wallet.name}
            breadcrumbs={[
                {
                    title: 'Wallets',
                    route: 'wallets.index',
                },
                {
                    title: wallet.name,
                    route: 'wallets.show',
                    params: { wallet: wallet.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={wallet.name}
                        description={`${getCurrencySymbol(wallet.currency)} ${wallet.currency}${wallet.is_default ? ' · Default wallet' : ''}`}
                        icon={getIcon(wallet.icon)}
                        color={wallet.color}
                    />
                    <EditButton href={route('wallets.edit', wallet.id)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            {formatCurrency(
                                wallet.initial_balance,
                                wallet.currency,
                            )}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Month Income
                        </p>
                        <p className="mt-1 text-lg font-semibold text-green-600 tabular-nums">
                            {formatCurrency(0, wallet.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Month Expenses
                        </p>
                        <p className="mt-1 text-lg font-semibold text-red-500 tabular-nums">
                            {formatCurrency(0, wallet.currency)}
                        </p>
                    </div>
                </div>
                <div className="border p-4">
                    <p className="text-xs text-muted-foreground">
                        No transactions yet.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsShow;
