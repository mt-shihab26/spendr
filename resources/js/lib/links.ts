import {
    ArrowRightLeft,
    ChartBar,
    CircleDollarSign,
    Folder,
    Landmark,
    LayoutGrid,
    RefreshCw,
    Repeat,
    Tag,
    Target,
    Wallet,
} from 'lucide-react';

import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type TLink = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    description?: string;
};

export type TNavGroup = {
    type: 'group';
    title: string;
    icon?: LucideIcon | null;
    links: TLink[];
};

export type TNavLink = TLink & { type: 'link' };

export type TNavEntry = TNavGroup | TNavLink;

export const navEntries = (): TNavEntry[] => [
    {
        type: 'link',
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        type: 'group',
        title: 'Accounts',
        icon: Landmark,
        links: [
            {
                title: 'Wallets',
                href: route('wallets.index'),
                icon: Wallet,
                description: 'Manage your accounts and balances',
            },
            {
                title: 'Transfers',
                href: route('transfers.index'),
                icon: Repeat,
                description: 'Move money between wallets',
            },
            {
                title: 'Recurring',
                href: route('recurring-transactions.index'),
                icon: RefreshCw,
                description: 'Automated scheduled transactions',
            },
        ],
    },
    {
        type: 'link',
        title: 'Transactions',
        href: route('transactions.index'),
        icon: ArrowRightLeft,
    },
    {
        type: 'group',
        title: 'Planning',
        icon: Target,
        links: [
            {
                title: 'Budgets',
                href: route('budgets.index'),
                icon: CircleDollarSign,
                description: 'Set monthly spending limits',
            },
            {
                title: 'Goals',
                href: route('goals.index'),
                icon: Target,
                description: 'Track your savings targets',
            },
            {
                title: 'Categories',
                href: route('categories.index'),
                icon: Tag,
                description: 'Organise transactions by category',
            },
        ],
    },
    {
        type: 'link',
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
