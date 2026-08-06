import { formatCurrency } from '@/lib/formats';
import { cn } from '@/lib/utils';

type TSummaryRow = {
    month: string;
    key: string;
    income: number;
    expenses: number;
    net: number;
    savings_rate: number | null;
};

export const MonthlySummaryTable = ({ rows }: { rows: TSummaryRow[] }) => {
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
                            Income
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                            Expenses
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
                            <td className="px-4 py-2.5 font-medium">{row.month}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-green-600">
                                {formatCurrency(row.income)}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-red-500">
                                {formatCurrency(row.expenses)}
                            </td>
                            <td
                                className={cn(
                                    'px-4 py-2.5 text-right font-semibold tabular-nums',
                                    row.net >= 0 ? 'text-green-600' : 'text-red-500',
                                )}
                            >
                                {row.net >= 0 ? '+' : ''}
                                {formatCurrency(row.net)}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                                {row.savings_rate !== null ? `${row.savings_rate}%` : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
