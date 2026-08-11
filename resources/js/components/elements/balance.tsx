import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';
import { Wallet } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const Balance = ({
    balance,
    currency,
    prominent = true,
}: {
    balance: number;
    currency: TCurrency;
    prominent?: boolean;
}) => {
    if (!prominent) {
        return (
            <StatItem
                icon={Wallet}
                iconClassName="text-balance"
                label="Balance"
                value={balance}
                currency={currency}
            />
        );
    }

    return (
        <div className="min-w-28">
            <p className="text-xs text-muted-foreground">{currency} Balance</p>
            <p className="text-lg font-bold text-balance tabular-nums">
                {formatCurrency(balance, currency)}
            </p>
        </div>
    );
};
