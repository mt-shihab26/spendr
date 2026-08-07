import type { TType } from '@/types/enums';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const options: { value: TType; label: string }[] = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
];

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
            {options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem
                        id={`type-${option.value}`}
                        value={option.value}
                    />
                    <Label
                        htmlFor={`type-${option.value}`}
                        className="cursor-pointer font-normal"
                    >
                        {option.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
};
