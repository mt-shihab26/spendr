import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';
import { cn } from '@/lib/utils';

export type TSummary = {
    balance: number;
    income: number;
    expenses: number;
    net: number;
};

export const ReportsSummary = ({
    summary,
    currency,
}: {
    summary: TSummary;
    currency: TCurrency;
}) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[
                { label: '+', value: summary.income, color: 'text-income' },
                { label: '−', value: summary.expenses, color: 'text-expense' },
                {
                    label: 'Net',
                    value: summary.net,
                    color: summary.net >= 0 ? 'text-income' : 'text-expense',
                },
            ].map(({ label, value, color }) => (
                <div key={label} className="border p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p
                        className={cn(
                            'mt-1 text-lg font-semibold tabular-nums',
                            color,
                        )}
                    >
                        {formatCurrency(value, currency)}
                    </p>
                </div>
            ))}
        </div>
    );
};
