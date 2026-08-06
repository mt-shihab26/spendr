import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formats';
import { getCurrencySymbol } from '@/lib/currency';

import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
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
                        <span className="flex-1 text-xs font-medium">
                            {wallet.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {getCurrencySymbol(wallet.currency)}{' '}
                            {wallet.currency}
                        </span>
                        {wallet.is_default && (
                            <Badge variant="secondary">Default</Badge>
                        )}
                        <span className="text-xs font-medium tabular-nums">
                            {formatCurrency(
                                wallet.initial_balance,
                                wallet.currency,
                            )}
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
