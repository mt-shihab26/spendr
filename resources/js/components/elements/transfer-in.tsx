import type { TCurrency } from '@/types/enums';

import { ArrowDownLeft } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const TransferIn = ({ amount, currency }: { amount: number; currency: TCurrency }) => (
    <StatItem icon={ArrowDownLeft} iconClassName="text-income" label="Transfer In" value={amount} currency={currency} />
);
