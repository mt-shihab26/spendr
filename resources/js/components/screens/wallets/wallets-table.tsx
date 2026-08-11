import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';

import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { InitialBalance } from '@/components/elements/initial-balance';
import { Income } from '@/components/elements/income';
import { Expense } from '@/components/elements/expense';
import { TransferIn } from '@/components/elements/transfer-in';
import { TransferOut } from '@/components/elements/transfer-out';
import { Balance } from '@/components/elements/balance';
import { Net } from '@/components/elements/net';
import { WalletActions } from '@/components/screens/wallets/wallet-actions';
import { WalletDeleteDialog } from '@/components/screens/wallets/wallet-delete-dialog';

export type TTableWallet = TWallet & {
    balance: number;
    income: number;
    expense: number;
    net: number;
    transfers_in: number;
    transfers_out: number;
};

export const WalletsTable = ({ wallets }: { wallets: TTableWallet[] }) => {
    const [walletToDelete, setWalletToDelete] = useState<TWallet | null>(null);

    return (
        <>
            <div className="divide-y border">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                        <div className="flex items-center gap-4">
                            <IconBadge
                                icon={wallet.icon}
                                color={wallet.color}
                            />
                            <Link
                                href={route('wallets.show', wallet.id)}
                                className="flex-1 text-sm font-medium hover:underline"
                            >
                                {wallet.name}
                            </Link>
                            <Badge variant="secondary" className="text-xs">
                                {getCurrencySymbol(wallet.currency)}{' '}
                                {wallet.currency}
                            </Badge>
                            {wallet.is_default && (
                                <Badge variant="outline" className="text-xs">
                                    Default
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <InitialBalance amount={wallet.initial_balance} currency={wallet.currency} />
                            <Income income={wallet.income} currency={wallet.currency} />
                            <Expense expense={wallet.expense} currency={wallet.currency} />
                            {wallet.transfers_in > 0 && <TransferIn amount={wallet.transfers_in} currency={wallet.currency} />}
                            {wallet.transfers_out > 0 && <TransferOut amount={wallet.transfers_out} currency={wallet.currency} />}
                            <Balance balance={wallet.balance} currency={wallet.currency} prominent={false} />
                            <Net net={wallet.net} currency={wallet.currency} />
                            <WalletActions
                                wallet={wallet}
                                onDelete={setWalletToDelete}
                            />
                        </div>
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
