import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TFrequency } from '@/types/enums';

import { frequencyOptions } from '@/lib/options';

export const FrequencySelect = ({
    value,
    onValueChange,
    disabled = false,
}: {
    value: TFrequency | null;
    onValueChange: (value: TFrequency) => void;
    disabled?: boolean;
}) => {
    const selected = frequencyOptions.find((o) => o.value === value);

    return (
        <Select
            value={value ?? undefined}
            onValueChange={(v) => onValueChange(v as TFrequency)}
            disabled={disabled}
        >
            <SelectTrigger className="w-full">
                {selected ? (
                    <div className="flex items-center gap-2">
                        <selected.icon className="size-4 text-muted-foreground" />
                        {selected.label}
                    </div>
                ) : (
                    <SelectValue placeholder="Select frequency" />
                )}
            </SelectTrigger>
            <SelectContent>
                {frequencyOptions.map(({ value: val, label, icon: Icon }) => (
                    <SelectItem key={val} value={val}>
                        <div className="flex items-center gap-2">
                            <Icon className="size-4 text-muted-foreground" />
                            {label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
