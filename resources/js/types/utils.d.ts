import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type TBreadcrumb = {
    title: string;
    route: string;
    params?: Record<string, string | number>;
};

export type TTransactionPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export type TPaginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};
