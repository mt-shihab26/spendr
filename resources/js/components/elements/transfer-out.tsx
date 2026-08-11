import type { TCurrency } from '@/types/enums';

import { ArrowUpRight } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const TransferOut = ({ amount, currency }: { amount: number; currency: TCurrency }) => (
    <StatItem icon={ArrowUpRight} iconClassName="text-expense" label="Transfer Out" value={amount} currency={currency} />
);
