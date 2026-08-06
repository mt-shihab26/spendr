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
import { CurrencyTabs } from '@/components/elements/currency-tabs';
import { ShowBalance } from '@/components/elements/show-balance';

type TSummary = {
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
    date_from,
    date_to,
    currency = 'BDT',
    wallet_id,
    currencies,
    wallets,
    balance,
}: {
    monthly_cash_flow: TCashFlowRow[];
    monthly_summary: TCashFlowRow[];
    expense_breakdown: TCategoryRow[];
    income_breakdown: TCategoryRow[];
    summary: TSummary;
    date_from: string | null;
    date_to: string | null;
    currency: TCurrency;
    wallet_id: string | null;
    currencies: TCurrency[];
    wallets: TWallet[];
    balance: number;
}) => {
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
                <div className="flex items-center justify-between gap-4">
                    <CurrencyTabs
                        href={route('reports.index')}
                        currency={currency}
                        currencies={currencies}
                    />
                    <ShowBalance balance={balance} currency={currency} />
                </div>

                <ReportsFilter
                    dateFrom={date_from}
                    dateTo={date_to}
                    currency={currency}
                    walletId={wallet_id}
                    wallets={wallets}
                />

                <ReportsSummary summary={summary} currency={currency} />

                <CashFlowChart data={monthly_cash_flow} currency={currency} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <CategoryDonut
                        title="Expenses by Category"
                        data={expense_breakdown}
                        currency={currency}
                    />
                    <CategoryDonut
                        title="Income by Category"
                        data={income_breakdown}
                        currency={currency}
                    />
                </div>

                <MonthlySummaryTable
                    rows={monthly_summary}
                    currency={currency}
                />
            </div>
        </AppLayout>
    );
};

export default ReportsIndex;
