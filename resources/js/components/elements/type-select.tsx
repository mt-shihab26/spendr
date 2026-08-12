import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TType } from '@/types/enums';

import { typeOptions, getTypeOption } from '@/lib/options';

export const TypeSelect = ({
    value,
    onValueChange,
    disabled = false,
    includeAll,
}: {
    value: TType | null;
    onValueChange: (value: TType | null) => void;
    disabled?: boolean;
    includeAll?: boolean;
}) => {
    const selected = value ? getTypeOption(value) : undefined;

    return (
        <Select
            value={value ?? ''}
            onValueChange={(v) => onValueChange((v || null) as TType | null)}
            disabled={disabled}
        >
            <SelectTrigger className="w-full">
                {selected ? (
                    <div className="flex items-center gap-2">
                        <selected.icon
                            className="size-4"
                            style={{ color: selected.color }}
                        />
                        {selected.label}
                    </div>
                ) : (
                    <SelectValue
                        placeholder={includeAll ? 'All Types' : 'Select type'}
                    />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {includeAll && <SelectItem value="">All Types</SelectItem>}
                    {typeOptions.map(
                        ({ value: val, label, icon: Icon, color }) => (
                            <SelectItem key={val} value={val}>
                                <div className="flex items-center gap-2">
                                    <Icon
                                        className="size-4"
                                        style={{ color }}
                                    />
                                    {label}
                                </div>
                            </SelectItem>
                        ),
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
