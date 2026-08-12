import type { TFrequency } from '@/types/enums';
import type { LucideIcon } from 'lucide-react';

import { Sun, CalendarDays, CalendarRange, CalendarCheck2 } from 'lucide-react';

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

export const getFrequency = (value: TFrequency) => {
    return frequencyOptions.find((o) => o.value === value);
};
