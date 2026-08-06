import type { TCurrency } from '@/types/enums';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { CURRENCIES_OPTIONS } from '@/lib/options';

export const CurrencyPicker = ({
    value,
    onChange,
    options = CURRENCIES_OPTIONS,
}: {
    value: TCurrency;
    onChange: (currency: TCurrency) => void;
    options?: string[];
}) => {
    return (
        <RadioGroup
            value={value}
            onValueChange={(val) => onChange(val as TCurrency)}
            className="flex flex-wrap gap-3"
        >
            {options.map((currency) => (
                <div key={currency} className="flex items-center gap-2">
                    <RadioGroupItem
                        id={`currency-${currency}`}
                        value={currency}
                    />
                    <Label
                        htmlFor={`currency-${currency}`}
                        className="cursor-pointer font-normal"
                    >
                        {currency}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
};
