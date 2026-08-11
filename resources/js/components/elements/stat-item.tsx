import type { TCurrency } from '@/types/enums';
import type { LucideIcon } from 'lucide-react';

import { formatCurrency } from '@/lib/formats';

export const StatItem = ({
    icon: Icon,
    iconClassName,
    label,
    value,
    currency,
    valueClassName,
}: {
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: number;
    currency: TCurrency;
    valueClassName?: string;
}) => (
    <div className="flex items-center gap-1.5 text-xs">
        <Icon className={`size-3 ${iconClassName}`} />
        <div>
            <p className="text-muted-foreground">{label}</p>
            <p className={`font-medium tabular-nums ${valueClassName ?? ''}`}>
                {formatCurrency(value, currency)}
            </p>
        </div>
    </div>
);
