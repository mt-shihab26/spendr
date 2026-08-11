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
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wallet className="size-3 text-balance" />
                {currency} Balance
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
                {formatCurrency(balance, currency)}
            </p>
        </div>
    );
};
