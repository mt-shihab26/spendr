import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';

export const ActionsMenu = ({ children }: { children: ReactNode }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-xs" />}
            >
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-38">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const ActionsMenuSeparator = () => {
    return <DropdownMenuSeparator />;
};

export const ViewItem = ({ href }: { href: string }) => (
    <DropdownMenuItem render={<Link href={href} />}>
        <Eye />
        View
    </DropdownMenuItem>
);

export const EditItem = ({ href }: { href: string }) => (
    <DropdownMenuItem render={<Link href={href} />}>
        <Pencil />
        Edit
    </DropdownMenuItem>
);

export const SetDefaultItem = ({ onClick }: { onClick: () => void }) => (
    <DropdownMenuItem onClick={onClick}>
        <Star />
        Set as Default
    </DropdownMenuItem>
);

export const DeleteItem = ({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled?: boolean;
}) => (
    <DropdownMenuItem
        variant="destructive"
        className="text-destructive!"
        onClick={onClick}
        disabled={disabled}
    >
        <Trash2 />
        Delete
    </DropdownMenuItem>
);
