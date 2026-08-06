import type { TCurrency } from '@/types/enums';

import { format, parseISO } from 'date-fns';

import { getCurrencySymbol } from '@/lib/currency';

export const formatInitial = (fullName: string): string => {
    const getInitial = (name: string): string => Array.from(name)[0] ?? '';
    const names = fullName.trim().split(/\s+/u).filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return getInitial(names[0]).toUpperCase();
    const firstInitial = getInitial(names[0]);
    const lastInitial = getInitial(names[names.length - 1]);
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const formatCurrency = (
    amount: number | string,
    currency: TCurrency | undefined = 'BDT',
): string => {
    const formatted = new Intl.NumberFormat(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount));

    return `${getCurrencySymbol(currency ?? 'BDT')}${formatted}`;
};

export const localToUtcDatetime = (localDatetime: string): string => {
    return parseISO(localDatetime).toISOString();
};

export const utcToLocalDatetimeInput = (utcDatetime: string): string => {
    return format(parseISO(utcDatetime), "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatLocalDateTime = (
    date: string | null | undefined,
    pattern = 'MMM d, yyyy h:mm a',
): string => {
    return date ? format(parseISO(date), pattern) : '';
};

export const nowUtcIso = (): string => {
    return new Date().toISOString();
};
