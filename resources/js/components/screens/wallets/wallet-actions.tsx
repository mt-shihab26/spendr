import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WalletActions = ({
    wallet,
    onDelete,
}: {
    wallet: TWallet;
    onDelete: (wallet: TWallet) => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-xs" />}
            >
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    render={<Link href={route('wallets.show', wallet.id)} />}
                >
                    View
                </DropdownMenuItem>
                <DropdownMenuItem
                    render={<Link href={route('wallets.edit', wallet.id)} />}
                >
                    Edit
                </DropdownMenuItem>
                {!wallet.is_default && (
                    <DropdownMenuItem
                        onClick={() =>
                            router.patch(route('wallets.update', wallet.id), {
                                is_default: true,
                            })
                        }
                    >
                        Set as Default
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(wallet)}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
