import type { TType } from '@/types/enums';

import { typeOptions } from '@/lib/options';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const TypePicker = ({
    value,
    onChange,
    disabled = false,
}: {
    value: TType;
    onChange: (value: TType) => void;
    disabled?: boolean;
}) => {
    return (
        <RadioGroup
            value={value}
            onValueChange={(val) => onChange(val as TType)}
            disabled={disabled}
            className="flex gap-4"
        >
            {typeOptions.map(({ value: val, label, icon: Icon, color }) => (
                <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem id={`type-${val}`} value={val} />
                    <Label
                        htmlFor={`type-${val}`}
                        className="flex cursor-pointer items-center gap-1.5 font-normal"
                    >
                        <Icon className="size-4" style={{ color }} />
                        {label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
};
