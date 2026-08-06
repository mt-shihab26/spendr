import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

import { Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { CURRENCY_SYMBOLS } from '@/lib/options';

export const WalletsTable = ({ wallets }: { wallets: TWallet[] }) => {
    const [walletToDelete, setWalletToDelete] = useState<TWallet | null>(null);

    const handleDelete = () => {
        if (!walletToDelete) return;
        router.delete(route('wallets.destroy', walletToDelete.id), {
            onSuccess: () => setWalletToDelete(null),
        });
    };

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
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="ghost" size="icon-xs" />
                                }
                            >
                                <MoreHorizontal />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    render={
                                        <Link
                                            href={route(
                                                'wallets.show',
                                                wallet.id,
                                            )}
                                        />
                                    }
                                >
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    render={
                                        <Link
                                            href={route(
                                                'wallets.edit',
                                                wallet.id,
                                            )}
                                        />
                                    }
                                >
                                    Edit
                                </DropdownMenuItem>
                                {!wallet.is_default && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.patch(
                                                route(
                                                    'wallets.update',
                                                    wallet.id,
                                                ),
                                                {
                                                    is_default: true,
                                                },
                                            )
                                        }
                                    >
                                        Set as Default
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setWalletToDelete(wallet)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
