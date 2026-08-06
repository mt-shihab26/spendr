import {
    ArrowRightLeft,
    BookOpen,
    ChartBar,
    CircleDollarSign,
    Folder,
    LayoutGrid,
    Repeat,
    Tag,
    Wallet,
} from 'lucide-react';

import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

type TLink = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
};

export const mainLinks = (): TLink[] => [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Wallets',
        href: route('wallets.index'),
        icon: Wallet,
    },
    {
        title: 'Transactions',
        href: '/transactions',
        icon: ArrowRightLeft,
    },
    {
        title: 'Transfers',
        href: '/transfers',
        icon: Repeat,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Tag,
    },
    {
        title: 'Budgets',
        href: '/transfers',
        icon: CircleDollarSign,
    },

    {
        title: 'Reports',
        href: '/reports',
        icon: ChartBar,
    },
];

export const rightLinks = (): TLink[] => [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
