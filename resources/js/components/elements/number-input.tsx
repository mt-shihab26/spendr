import type { NumericFormatProps } from 'react-number-format';

import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';

export const NumberInput = (props: Omit<NumericFormatProps, 'customInput'>) => {
    return <NumericFormat customInput={Input} {...props} />;
};
