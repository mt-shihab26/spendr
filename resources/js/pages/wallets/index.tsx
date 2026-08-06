import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

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

import type { TCurrency } from '@/types/enums';
import type { TWallet } from '@/types/models';

import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { MoreHorizontal, Plus, Wallet } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formats';

const WalletsIndex = ({ wallets }: { wallets: TWallet[] }) => {
    const [walletToDelete, setWalletToDelete] = useState<TWallet | null>(null);

    const netWorthByCurrency = wallets.reduce<Record<TCurrency, number>>(
        (acc, w) => ({
            ...acc,
            [w.currency]:
                (acc[w.currency] ?? 0) + parseFloat(w.initial_balance),
        }),
        {},
    );

    const handleDelete = () => {
        if (!walletToDelete) return;
        router.delete(route('wallets.destroy', walletToDelete.id), {
            onSuccess: () => setWalletToDelete(null),
        });
    };

    return (
        <AppLayout
            title="Wallets"
            description="Manage your accounts and balances"
            breadcrumbs={[{ title: 'Wallets', route: 'wallets.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Wallets"
                        description="Manage your accounts and balances"
                    />
                    <Button render={<Link href={route('wallets.create')} />}>
                        <Plus />
                        New Wallet
                    </Button>
                </div>
                {wallets.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <Wallet />
                            </EmptyMedia>
                            <EmptyTitle>No wallets yet</EmptyTitle>
                            <EmptyDescription>
                                Create your first wallet to start tracking your
                                finances.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button
                            render={<Link href={route('wallets.create')} />}
                        >
                            <Plus />
                            Create your first wallet
                        </Button>
                    </Empty>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground">
                            Net Worth:{' '}
                            {Object.entries(netWorthByCurrency).map(
                                ([currency, total], index) => (
                                    <span key={currency}>
                                        {index > 0 && (
                                            <span className="mx-1">+</span>
                                        )}
                                        <span className="font-medium text-foreground">
                                            {formatCurrency(
                                                total,
                                                currency as TCurrency,
                                            )}
                                        </span>
                                    </span>
                                ),
                            )}
                        </p>

                        <div className="divide-y border">
                            {wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="flex items-center gap-3 px-4 py-3"
                                >
                                    <span
                                        className="size-2.5 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: wallet.color,
                                        }}
                                    />
                                    <span className="flex-1 text-xs font-medium">
                                        {wallet.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {wallet.currency}
                                    </span>
                                    {wallet.is_default && (
                                        <Badge variant="secondary">
                                            Default
                                        </Badge>
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon-xs"
                                                />
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
                                                onClick={() =>
                                                    setWalletToDelete(wallet)
                                                }
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    </>
                )}
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
        </AppLayout>
    );
};

export default WalletsIndex;
