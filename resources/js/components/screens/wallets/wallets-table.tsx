import type { TWallet } from '@/types/models';
import type { TTableWallet } from '@/types/wallets';

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

export const WalletsTable = ({ wallets }: { wallets: TTableWallet[] }) => {
    const [walletToDelete, setWalletToDelete] = useState<TWallet | null>(null);

    return (
        <>
            <div className="divide-y border">
                {wallets.map((wallet) => {
                    const hasTransfers =
                        wallet.transfers_in > 0 || wallet.transfers_out > 0;

                    return (
                        <div
                            key={wallet.id}
                            className="flex items-center px-4 py-3"
                        >
                            <div className="flex w-[30%] shrink-0 items-center gap-4">
                                <IconBadge
                                    icon={wallet.icon}
                                    color={wallet.color}
                                />
                                <Link
                                    href={route('wallets.show', wallet.id)}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {wallet.name}
                                </Link>
                                <Badge variant="secondary" className="text-xs">
                                    {getCurrencySymbol(wallet.currency)}{' '}
                                    {wallet.currency}
                                </Badge>
                                {wallet.is_default && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        Default
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-1 items-center">
                                <div className="w-[14%]">
                                    <InitialBalance
                                        amount={wallet.initial_balance}
                                        currency={wallet.currency}
                                    />
                                </div>
                                <div className="w-[14%]">
                                    <Income
                                        income={wallet.income}
                                        currency={wallet.currency}
                                    />
                                </div>
                                <div className="w-[14%]">
                                    <Expense
                                        expense={wallet.expense}
                                        currency={wallet.currency}
                                    />
                                </div>
                                {hasTransfers && (
                                    <>
                                        <div className="w-[14%]">
                                            {wallet.transfers_in > 0 && (
                                                <TransferIn
                                                    amount={wallet.transfers_in}
                                                    currency={wallet.currency}
                                                />
                                            )}
                                        </div>
                                        <div className="w-[14%]">
                                            {wallet.transfers_out > 0 && (
                                                <TransferOut
                                                    amount={
                                                        wallet.transfers_out
                                                    }
                                                    currency={wallet.currency}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                <div className="w-[14%]">
                                    <Net
                                        net={wallet.net}
                                        currency={wallet.currency}
                                    />
                                </div>
                                <div className="w-[14%]">
                                    <Balance
                                        balance={wallet.balance}
                                        currency={wallet.currency}
                                        prominent={false}
                                    />
                                </div>
                                <div className="ml-auto">
                                    <WalletActions
                                        wallet={wallet}
                                        onDelete={setWalletToDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
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
