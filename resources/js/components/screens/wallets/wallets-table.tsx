import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';

import { Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionStats } from '@/components/elements/transaction-stats';
import { WalletActions } from '@/components/screens/wallets/wallet-actions';
import { WalletDeleteDialog } from '@/components/screens/wallets/wallet-delete-dialog';

export const WalletsTable = ({ wallets }: { wallets: TWallet[] }) => {
    const [walletToDelete, setWalletToDelete] = useState<TWallet | null>(null);

    return (
        <>
            <div className="divide-y border">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <IconBadge icon={wallet.icon} color={wallet.color} />
                        <Link
                            href={route('wallets.show', wallet.id)}
                            className="flex-1 text-xs font-medium hover:underline"
                        >
                            {wallet.name}
                        </Link>
                        {wallet.is_default && (
                            <Badge variant="secondary">Default</Badge>
                        )}
                        <TransactionStats
                            stats={[
                                {
                                    currency: wallet.currency,
                                    income: wallet.income ?? 0,
                                    expense: wallet.expense ?? 0,
                                },
                            ]}
                        />
                        <span className="text-sm">
                            {getCurrencySymbol(wallet.currency)}{' '}
                            {wallet.currency}
                        </span>
                        <WalletActions
                            wallet={wallet}
                            onDelete={setWalletToDelete}
                        />
                    </div>
                ))}
            </div>
            {walletToDelete && (
                <WalletDeleteDialog
                    wallet={walletToDelete}
                    open={!!walletToDelete}
                    onOpenChange={(open) => !open && setWalletToDelete(null)}
                    onDeleted={() => setWalletToDelete(null)}
                />
            )}
        </>
    );
};
