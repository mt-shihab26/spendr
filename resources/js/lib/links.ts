import {
    ArrowRightLeft,
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
        href: route('transactions.index'),
        icon: ArrowRightLeft,
    },
    {
        title: 'Transfers',
        href: route('transfers.index'),
        icon: Repeat,
    },
    {
        title: 'Categories',
        href: route('categories.index'),
        icon: Tag,
    },
    {
        title: 'Budgets',
        href: route('budgets.index'),
        icon: CircleDollarSign,
    },

    {
        title: 'Reports',
        href: route('reports.index'),
        icon: ChartBar,
    },
];

export const rightLinks = (): TLink[] => [
    {
        title: 'Repository',
        href: 'https://github.com/mt-shihab26/spendr',
        icon: Folder,
    },
];
