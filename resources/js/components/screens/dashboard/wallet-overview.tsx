import type { TWallet } from '@/types/models';

import { formatCurrency } from '@/lib/formats';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ViewAllLink } from '@/components/elements/view-all-link';

export type TDashboardWallet = TWallet & { balance: number };

export const WalletOverview = ({
    wallets,
}: {
    wallets: TDashboardWallet[];
}) => {
    return (
        <div className="h-full w-full border p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Top Wallets</p>
                <ViewAllLink href={route('wallets.index')}>
                    All Wallets
                </ViewAllLink>
            </div>
            {wallets.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        No wallets yet.
                    </p>
                    <Button
                        size="sm"
                        nativeButton={false}
                        render={<Link href={route('wallets.create')} />}
                    >
                        Create your first wallet
                    </Button>
                </div>
            ) : (
                <div className="divide-y">
                    {wallets.map((wallet) => (
                        <div
                            key={wallet.id}
                            className="flex items-center gap-2 py-2"
                        >
                            <span
                                className="size-2 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: wallet.color,
                                }}
                            />
                            <span className="flex-1 truncate text-xs">
                                {wallet.name}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                                {wallet.currency}
                            </span>
                            <span className="shrink-0 text-xs font-medium tabular-nums">
                                {formatCurrency(
                                    wallet.balance,
                                    wallet.currency,
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
