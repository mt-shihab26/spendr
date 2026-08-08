import {
    ArrowRightLeft,
    Bell,
    ChartBar,
    CircleDollarSign,
    Download,
    Folder,
    Landmark,
    LayoutGrid,
    Lock,
    Palette,
    RefreshCw,
    Repeat,
    Settings,
    SlidersHorizontal,
    Tag,
    Target,
    User,
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
    {
        type: 'group',
        title: 'Settings',
        icon: Settings,
        links: [
            {
                title: 'Profile',
                href: route('settings.profile.edit'),
                icon: User,
                description: 'Update your name and email',
            },
            {
                title: 'Security',
                href: route('settings.security.edit'),
                icon: Lock,
                description: 'Password, 2FA and passkeys',
            },
            {
                title: 'Appearance',
                href: route('settings.appearance.edit'),
                icon: Palette,
                description: 'Light, dark or system theme',
            },
            {
                title: 'Preferences',
                href: route('settings.preferences.edit'),
                icon: SlidersHorizontal,
                description: 'Default currency and week start',
            },
            {
                title: 'Notifications',
                href: route('settings.notifications.edit'),
                icon: Bell,
                description: 'Email alert preferences',
            },
            {
                title: 'Data',
                href: route('settings.data.edit'),
                icon: Download,
                description: 'Export all your data',
            },
        ],
    },
];

export const rightLinks = (): TLink[] => [
    {
        title: 'Repository',
        href: 'https://github.com/mt-shihab26/spendr',
        icon: Folder,
    },
];
