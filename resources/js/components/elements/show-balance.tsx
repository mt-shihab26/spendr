import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

export const ShowBalance = ({
    balance,
    currency,
}: {
    balance: number;
    currency: TCurrency;
}) => {
    return (
        <div className="text-right">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-lg font-semibold text-balance tabular-nums">
                {formatCurrency(balance, currency)}
            </p>
        </div>
    );
};
