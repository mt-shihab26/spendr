import type { NumericFormatProps } from 'react-number-format';

import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';

export const NumberInput = ({
    placeholder = '0.00',
    decimalScale = 2,
    fixedDecimalScale = true,
    thousandSeparator = true,
    allowNegative = false,
    ...props
}: Omit<NumericFormatProps, 'customInput'>) => {
    return (
        <NumericFormat
            placeholder={placeholder}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            thousandSeparator={thousandSeparator}
            allowNegative={allowNegative}
            customInput={Input}
            {...props}
        />
    );
};
