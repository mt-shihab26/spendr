import type { TCurrency } from '@/types/enums';
import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
import { getCurrencySymbol } from '@/lib/currency';
import { formatCurrency } from '@/lib/formats';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportsFilter } from '@/components/screens/reports/reports-filter';
import { ReportsSummary } from '@/components/screens/reports/reports-summary';
import { CashFlowChart } from '@/components/screens/reports/cash-flow-chart';
import { CategoryDonut } from '@/components/screens/reports/category-donut';
import { MonthlySummaryTable } from '@/components/screens/reports/monthly-summary-table';

export const CurrencyTabs = ({
    date_from,
    date_to,
    currency = 'BDT',
    currencies,
}: {
    date_from: string | null;
    date_to: string | null;
    currency: TCurrency;
    currencies: TCurrency[];
}) => {
    const switchCurrency = (c: string) => {
        router.get(
            route('reports.index'),
            Object.fromEntries(
                Object.entries({
                    currency: c,
                    date_from,
                    date_to,
                }).filter(([, v]) => v !== null && v !== undefined),
            ),
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <Tabs value={currency} onValueChange={switchCurrency}>
            <TabsList variant="line">
                {currencies.map((c) => (
                    <TabsTrigger
                        className="cursor-pointer text-lg"
                        key={c}
                        value={c}
                    >
                        {getCurrencySymbol(c)} {c}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};
