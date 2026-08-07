import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EditButton = ({ href }: { href: string }) => {
    return (
        <Button variant="outline" render={<Link href={href} />}>
            <Pencil />
            Edit
        </Button>
    );
};
