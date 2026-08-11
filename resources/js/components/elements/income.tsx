import type { TCurrency } from '@/types/enums';

import { Plus } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const Income = ({ income, currency }: { income: number; currency: TCurrency }) => (
    <StatItem icon={Plus} iconClassName="text-income" label="Income" value={income} currency={currency} />
);
