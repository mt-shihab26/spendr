import type { TCurrency } from '@/types/enums';

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
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount));
};
