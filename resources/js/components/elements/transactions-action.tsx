import { Link } from '@inertiajs/react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const TransactionsAction = ({
    type,
    href,
    count,
}: {
    type?: 'button';
    href: string;
    count?: number;
}) => {
    if (type === 'button') {
        return (
            <Button variant="outline" render={<Link href={href} />}>
                <List />
                Transactions
            </Button>
        );
    }

    return (
        <DropdownMenuItem render={<Link href={href} />}>
            <List />
            <div className="flex items-center gap-2">
                Transactions
                {count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                        {count}
                    </span>
                )}
            </div>
        </DropdownMenuItem>
    );
};
