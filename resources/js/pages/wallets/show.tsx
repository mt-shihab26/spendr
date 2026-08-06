import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formats';
import type { TWallet } from '@/types/models';

const WalletsShow = ({ wallet }: { wallet: TWallet }) => {
    return (
        <AppLayout
            title={wallet.name}
            description={wallet.name}
            breadcrumbs={[
                { title: 'Wallets', route: 'wallets.index' },
                {
                    title: wallet.name,
                    route: 'wallets.show',
                    params: { wallet: wallet.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading title={wallet.name} />
                    <Button
                        variant="outline"
                        render={
                            <Link href={route('wallets.edit', wallet.id)} />
                        }
                    >
                        <Pencil />
                        Edit
                    </Button>
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
                        <p className="mt-1 text-lg font-semibold tabular-nums text-green-600">
                            {formatCurrency(0, wallet.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Month Expenses
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-red-500">
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
