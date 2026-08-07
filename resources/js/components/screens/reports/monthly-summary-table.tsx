import type { TCurrency } from '@/types/enums';
import type { TCashFlowRow } from '@/types/reports';

import { formatCurrency } from '@/lib/formats';
import { cn } from '@/lib/utils';

export const MonthlySummaryTable = ({
    rows,
    currency,
}: {
    rows: TCashFlowRow[];
    currency: TCurrency;
}) => {
    if (rows.length === 0) {
        return (
            <div className="border p-4 text-center text-xs text-muted-foreground">
                No data for selected period.
            </div>
        );
    }

    return (
        <div className="border">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                            Month
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                            +
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                            −
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                            Net
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                            Savings Rate
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {rows.map((row) => (
                        <tr key={row.key} className="hover:bg-muted/30">
                            <td className="px-4 py-2.5 font-medium">
                                {row.month}
                            </td>
                            <td className="px-4 py-2.5 text-right text-green-600 tabular-nums">
                                {formatCurrency(row.income, currency)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-red-500 tabular-nums">
                                {formatCurrency(row.expenses, currency)}
                            </td>
                            <td
                                className={cn(
                                    'px-4 py-2.5 text-right font-semibold tabular-nums',
                                    row.net >= 0
                                        ? 'text-green-600'
                                        : 'text-red-500',
                                )}
                            >
                                {row.net >= 0 ? '+' : ''}
                                {formatCurrency(row.net, currency)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                                {row.savings_rate !== null
                                    ? `${row.savings_rate}%`
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
