import type { TCashFlowRow } from '@/types/reports';

import { Button } from '@/components/ui/button';

const exportCsv = (rows: TCashFlowRow[]) => {
    const header = 'Month,Income,Expenses,Net,Savings Rate\n';
    const body = rows
        .map(
            (r) =>
                `${r.month},${r.income},${r.expenses},${r.net},${r.savings_rate ?? ''}`,
        )
        .join('\n');

    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
    URL.revokeObjectURL(url);
};

export const ExportCSV = ({
    monthlySummary,
}: {
    monthlySummary: TCashFlowRow[];
}) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => exportCsv(monthlySummary)}
        >
            Export CSV
        </Button>
    );
};
