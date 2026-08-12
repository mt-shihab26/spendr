import { Link } from '@inertiajs/react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const TransfersAction = ({
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
                <ArrowLeftRight />
                Transfers
            </Button>
        );
    }

    return (
        <DropdownMenuItem render={<Link href={href} />}>
            <ArrowLeftRight />
            <div className="flex items-center gap-2">
                Transfers
                {count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                        {count}
                    </span>
                )}
            </div>
        </DropdownMenuItem>
    );
};
