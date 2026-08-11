import type { TCurrency } from '@/types/enums';

import { Equal } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const Net = ({ net, currency }: { net: number; currency: TCurrency }) => (
    <StatItem
        icon={Equal}
        iconClassName={net >= 0 ? 'text-income' : 'text-expense'}
        label="Net"
        value={net}
        currency={currency}
    />
);
