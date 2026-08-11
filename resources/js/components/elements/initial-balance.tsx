import type { TCurrency } from '@/types/enums';

import { Landmark } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const InitialBalance = ({
    amount,
    currency,
}: {
    amount: number;
    currency: TCurrency;
}) => (
    <StatItem
        icon={Landmark}
        iconClassName="text-initial-balance"
        label="Initial"
        value={amount}
        currency={currency}
    />
);
