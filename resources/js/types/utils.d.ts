import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type TBreadcrumb = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type TNavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
