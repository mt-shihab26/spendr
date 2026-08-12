import type { TFrequency } from '@/types/enums';

import { CalendarClock } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const FREQUENCY_OPTIONS: { value: TFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
];

export const FrequencySelect = ({
    value,
    onValueChange,
    disabled = false,
}: {
    value: TFrequency | null;
    onValueChange: (value: TFrequency) => void;
    disabled?: boolean;
}) => {
    const selected = FREQUENCY_OPTIONS.find((o) => o.value === value);

    return (
        <Select
            value={value ?? undefined}
            onValueChange={(v) => onValueChange(v as TFrequency)}
            disabled={disabled}
        >
            <SelectTrigger className="w-full">
                {selected ? (
                    <div className="flex items-center gap-2">
                        <CalendarClock className="size-4 text-muted-foreground" />
                        {selected.label}
                    </div>
                ) : (
                    <SelectValue placeholder="Select frequency" />
                )}
            </SelectTrigger>
            <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                            <CalendarClock className="size-4 text-muted-foreground" />
                            {option.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
