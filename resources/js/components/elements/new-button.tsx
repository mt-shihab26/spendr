import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NewButton = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => {
    return (
        <Button render={<Link href={href} />}>
            <Plus />
            {children}
        </Button>
    );
};
