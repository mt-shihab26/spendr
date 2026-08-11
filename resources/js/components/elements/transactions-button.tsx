import { Link } from '@inertiajs/react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TransactionsButton = ({ href }: { href: string }) => {
    return (
        <Button variant="outline" render={<Link href={href} />}>
            <List />
            Transactions
        </Button>
    );
};
