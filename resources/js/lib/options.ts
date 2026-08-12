import type { TFrequency, TType } from '@/types/enums';
import type { LucideIcon } from 'lucide-react';

import {
    Plus,
    Minus,
    Sun,
    CalendarDays,
    CalendarRange,
    CalendarCheck2,
} from 'lucide-react';

export const typeOptions: {
    value: TType;
    label: string;
    icon: LucideIcon;
    color: string;
}[] = [
    { value: 'expense', label: 'Expense', icon: Minus, color: '#ef4444' },
    { value: 'income', label: 'Income', icon: Plus, color: '#22c55e' },
];

export const getTypeOption = (value: TType) => {
    return typeOptions.find((o) => o.value === value);
};

export const frequencyOptions: {
    value: TFrequency;
    label: string;
    icon: LucideIcon;
}[] = [
    { value: 'daily', label: 'Daily', icon: Sun },
    { value: 'weekly', label: 'Weekly', icon: CalendarDays },
    { value: 'monthly', label: 'Monthly', icon: CalendarRange },
    { value: 'yearly', label: 'Yearly', icon: CalendarCheck2 },
];

export const getFrequencyOption = (value: TFrequency) => {
    return frequencyOptions.find((o) => o.value === value);
};
