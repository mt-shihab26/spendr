import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { TCategory } from '@/types/models';

import { Link } from '@inertiajs/react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CategoryActions = ({
    category,
    onDelete,
}: {
    category: TCategory;
    onDelete: (category: TCategory) => void;
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
                    render={
                        <Link href={route('categories.show', category.id)} />
                    }
                >
                    View
                </DropdownMenuItem>
                <DropdownMenuItem
                    render={
                        <Link href={route('categories.edit', category.id)} />
                    }
                >
                    Edit
                </DropdownMenuItem>
                {!category.is_default && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            className="text-destructive!"
                            onClick={() => onDelete(category)}
                        >
                            <Trash2 />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
