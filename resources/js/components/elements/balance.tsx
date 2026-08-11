import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

export const Balance = ({
    balance,
    currency,
}: {
    balance: number;
    currency: TCurrency;
}) => (
    <div className="min-w-28">
        <p className="text-xs text-muted-foreground">{currency} Balance</p>
        <p className="text-lg font-bold text-balance tabular-nums">
            {formatCurrency(balance, currency)}
        </p>
    </div>
);
