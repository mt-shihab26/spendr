import type { TCurrency } from '@/types/enums';

import { Minus } from 'lucide-react';
import { StatItem } from '@/components/elements/stat-item';

export const Expense = ({ expense, currency }: { expense: number; currency: TCurrency }) => (
    <StatItem icon={Minus} iconClassName="text-expense" label="Expenses" value={expense} currency={currency} valueClassName="text-expense" />
);
