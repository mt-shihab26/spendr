import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';
import { formatCurrency } from '@/lib/formats';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { ProfitLossBadge } from '@/components/elements/profit-loss-badge';
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
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground">
                                    Initial
                                </span>
                                <span className="font-medium text-initial-balance tabular-nums">
                                    {formatCurrency(
                                        wallet.initial_balance,
                                        wallet.currency,
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground">
                                    Income
                                </span>
                                <span className="font-medium text-income tabular-nums">
                                    {formatCurrency(
                                        wallet.income ?? 0,
                                        wallet.currency,
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground">
                                    Expenses
                                </span>
                                <span className="font-medium text-expense tabular-nums">
                                    {formatCurrency(
                                        wallet.expense ?? 0,
                                        wallet.currency,
                                    )}
                                </span>
                            </div>
                            {(wallet.transfers_in > 0 ||
                                wallet.transfers_out > 0) && (
                                <>
                                    {wallet.transfers_in > 0 && (
                                        <div className="flex flex-col items-end">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <ArrowDownLeft className="size-3 text-income" />
                                                In
                                            </span>
                                            <span className="font-medium tabular-nums">
                                                {formatCurrency(
                                                    wallet.transfers_in,
                                                    wallet.currency,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {wallet.transfers_out > 0 && (
                                        <div className="flex flex-col items-end">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <ArrowUpRight className="size-3 text-expense" />
                                                Out
                                            </span>
                                            <span className="font-medium tabular-nums">
                                                {formatCurrency(
                                                    wallet.transfers_out,
                                                    wallet.currency,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground">
                                    Balance
                                </span>
                                <span className="font-medium text-balance tabular-nums">
                                    {formatCurrency(
                                        wallet.balance ?? 0,
                                        wallet.currency,
                                    )}
                                </span>
                            </div>
                            <ProfitLossBadge net={wallet.net ?? 0} />
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
