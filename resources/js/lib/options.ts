import type { TCurrency } from '@/types/enums';

export const CURRENCY_SYMBOLS: Record<TCurrency, string> = {
    BDT: '৳',
    USD: '$',
};

export const CURRENCIES_OPTIONS = Object.keys(CURRENCY_SYMBOLS) as TCurrency[];
