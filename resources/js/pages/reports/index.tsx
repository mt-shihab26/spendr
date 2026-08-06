import type { TCurrency } from '@/types/enums';
import type { TWallet } from '@/types/models';
import type { TSummary } from '@/components/screens/reports/reports-summary';
import { type TCashFlowRow } from '@/components/screens/reports/cash-flow-chart';

import { router } from '@inertiajs/react';

import { AppLayout } from '@/components/layouts/app-layout';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { ReportsSummary } from '@/components/screens/reports/reports-summary';
import { CashFlowChart } from '@/components/screens/reports/cash-flow-chart';
import { CategoryDonut } from '@/components/screens/reports/category-donut';
import { MonthlySummaryTable } from '@/components/screens/reports/monthly-summary-table';
import { CurrencyTabs } from '@/components/elements/currency-tabs';
import { ShowBalance } from '@/components/elements/show-balance';
import { WalletSelect } from '@/components/elements/wallet-select';
import { ExportCSV } from '@/components/screens/reports/export-csv';

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
    const navigate = (params: Record<string, string | null>) => {
        router.get(
            route('reports.index'),
            Object.fromEntries(
                Object.entries({
                    currency,
                    wallet_id,
                    date_from,
                    date_to,
                    ...params,
                }).filter(([, v]) => v !== null && v !== undefined),
            ),
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

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
                    <ExportCSV monthlySummary={monthly_summary} />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <CurrencyTabs
                        href={route('reports.index')}
                        currency={currency}
                        currencies={currencies}
                    />
                    <ShowBalance balance={balance} currency={currency} />
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <WalletSelect
                            wallets={wallets}
                            value={wallet_id ?? ''}
                            includeAll
                            onValueChange={(wallet_id) =>
                                navigate({ wallet_id })
                            }
                        />
                    </div>
                    <DateRangePicker
                        dateFrom={date_from}
                        dateTo={date_to}
                        onClear={() =>
                            navigate({ date_from: null, date_to: null })
                        }
                        onSelect={(dates) =>
                            navigate({
                                date_from: dates?.from ?? null,
                                date_to: dates?.to ?? null,
                            })
                        }
                    />
                </div>
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
