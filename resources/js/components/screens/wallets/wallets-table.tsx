import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formats';
import { getCurrencySymbol } from '@/lib/currency';

import { Plus, Minus, Equal } from 'lucide-react';
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
                        {wallet.is_default && (
                            <Badge variant="secondary">Default</Badge>
                        )}
                        <div className="flex items-center gap-3 text-xs tabular-nums">
                            <span className="flex items-center gap-1 font-medium text-green-600">
                                <Plus className="size-3" />
                                {formatCurrency(
                                    wallet.income ?? 0,
                                    wallet.currency,
                                )}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-red-500">
                                <Minus className="size-3" />
                                {formatCurrency(
                                    wallet.expense ?? 0,
                                    wallet.currency,
                                )}
                            </span>
                            <span
                                className={`flex items-center gap-1 font-medium ${(wallet.income ?? 0) - (wallet.expense ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}
                            >
                                <Equal className="size-3" />
                                {formatCurrency(
                                    (wallet.income ?? 0) -
                                        (wallet.expense ?? 0),
                                    wallet.currency,
                                )}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
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
