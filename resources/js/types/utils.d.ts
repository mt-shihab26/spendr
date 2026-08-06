import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type TBreadcrumb = {
    title: string;
    route: string;
    params?: Record<string, string | number>;
};
