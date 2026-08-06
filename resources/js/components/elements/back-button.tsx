import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BackButton = ({ href }: { href: string }) => {
    return (
        <Button variant="outline" render={<Link href={href} />}>
            <ArrowLeft />
            Back
        </Button>
    );
};
