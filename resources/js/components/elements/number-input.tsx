import type { NumericFormatProps } from 'react-number-format';
import type { TCurrency } from '@/types/enums';

import { getCurrencySymbol } from '@/lib/currency';

import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';

export const NumberInput = ({
    placeholder = '0.00',
    decimalScale = 2,
    fixedDecimalScale = true,
    thousandSeparator = true,
    allowNegative = false,
    currency,
    ...props
}: Omit<NumericFormatProps, 'customInput'> & { currency?: TCurrency }) => {
    return (
        <NumericFormat
            placeholder={placeholder}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            thousandSeparator={thousandSeparator}
            allowNegative={allowNegative}
            customInput={Input}
            prefix={currency ? getCurrencySymbol(currency) : ''}
            {...props}
        />
    );
};
