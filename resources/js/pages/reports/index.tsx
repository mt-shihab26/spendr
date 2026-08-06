import type { TCurrency } from '@/types/enums';
import type { TWallet } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { ReportsFilter } from '@/components/screens/reports/reports-filter';
import { ReportsSummary } from '@/components/screens/reports/reports-summary';
import { CashFlowChart } from '@/components/screens/reports/cash-flow-chart';
import { CategoryDonut } from '@/components/screens/reports/category-donut';
import { MonthlySummaryTable } from '@/components/screens/reports/monthly-summary-table';

type TSummary = {
    balance: number;
    income: number;
    expenses: number;
    net: number;
};

type TCashFlowRow = {
    month: string;
    key: string;
    income: number;
    expenses: number;
    net: number;
    savings_rate: number | null;
};

type TCategoryRow = {
    name: string;
    color: string;
    total: number;
    percentage: number;
};

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

const ReportsIndex = ({
    monthly_cash_flow,
    monthly_summary,
    expense_breakdown,
    income_breakdown,
    summary,
    range,
    date_from,
    date_to,
    currency,
    wallet_id,
    currencies,
    wallets,
}: {
    monthly_cash_flow: TCashFlowRow[];
    monthly_summary: TCashFlowRow[];
    expense_breakdown: TCategoryRow[];
    income_breakdown: TCategoryRow[];
    summary: TSummary;
    range: string | null;
    date_from: string | null;
    date_to: string | null;
    currency: TCurrency | null;
    wallet_id: string | null;
    currencies: TCurrency[];
    wallets: TWallet[];
}) => {
    const cur = currency ?? 'BDT';

    return (
        <AppLayout
            title="Reports"
            description="Analyse your spending and income trends"
            breadcrumbs={[{ title: 'Reports', route: 'reports.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Heading
                        title="Reports"
                        description="Analyse your spending and income trends"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportCsv(monthly_summary)}
                    >
                        Export CSV
                    </Button>
                </div>

                <ReportsSummary summary={summary} currency={cur} />

                <ReportsFilter
                    range={range}
                    dateFrom={date_from}
                    dateTo={date_to}
                    currency={currency}
                    walletId={wallet_id}
                    currencies={currencies}
                    wallets={wallets}
                />

                <CashFlowChart data={monthly_cash_flow} currency={cur} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <CategoryDonut
                        title="Expenses by Category"
                        data={expense_breakdown}
                        currency={cur}
                    />
                    <CategoryDonut
                        title="Income by Category"
                        data={income_breakdown}
                        currency={cur}
                    />
                </div>

                <MonthlySummaryTable rows={monthly_summary} currency={cur} />
            </div>
        </AppLayout>
    );
};

export default ReportsIndex;
