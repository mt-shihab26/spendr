import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/formats';
import { getIcon } from '@/lib/icons';

import { Badge } from '@/components/ui/badge';
import { WalletActions } from '@/components/screens/wallets/wallet-actions';

import { CURRENCY_SYMBOLS } from '@/lib/options';

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
                        {(() => {
                            const Icon = getIcon(wallet.icon);
                            return Icon ? (
                                <span
                                    className="flex size-6 shrink-0 items-center justify-center rounded-full"
                                    style={{ backgroundColor: wallet.color }}
                                >
                                    <Icon className="size-3 text-white" />
                                </span>
                            ) : (
                                <span
                                    className="size-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: wallet.color }}
                                />
                            );
                        })()}
                        <span className="flex-1 text-xs font-medium">
                            {wallet.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {CURRENCY_SYMBOLS[wallet.currency]}{' '}
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
            <AlertDialog
                open={!!walletToDelete}
                onOpenChange={(open) => !open && setWalletToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete "{walletToDelete?.name}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. Reassign or delete all
                            transactions first.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (!walletToDelete) return;
                                router.delete(
                                    route('wallets.destroy', walletToDelete.id),
                                    {
                                        onSuccess: () =>
                                            setWalletToDelete(null),
                                    },
                                );
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
