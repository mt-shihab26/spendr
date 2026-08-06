import type { TCurrency } from '@/types/enums';

import { CURRENCY_SYMBOLS } from '@/lib/options';

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
    currency: TCurrency,
): string => {
    const formatted = new Intl.NumberFormat(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount));

    return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
};
