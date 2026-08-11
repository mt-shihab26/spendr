import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export const ViewAllLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => {
    return (
        <Link
            href={href}
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:underline"
        >
            {children}
            <ArrowRight className="size-3" />
        </Link>
    );
};
