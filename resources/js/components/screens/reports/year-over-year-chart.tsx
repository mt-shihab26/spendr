import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from 'recharts';

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
} from '@/components/ui/chart';

import type { TCurrency } from '@/types/enums';
import type { ChartConfig } from '@/components/ui/chart';
import type { TYearOverYearRow } from '@/types/reports';

import { formatCurrency } from '@/lib/formats';

const thisYear = new Date().getFullYear();
const prevYear = thisYear - 1;

const chartConfig = {
    current_income: { label: `${thisYear} Income`, color: '#22c55e' },
    current_expenses: { label: `${thisYear} Expenses`, color: '#ef4444' },
    prev_income: { label: `${prevYear} Income`, color: '#86efac' },
    prev_expenses: { label: `${prevYear} Expenses`, color: '#fca5a5' },
} satisfies ChartConfig;

export const YearOverYearChart = ({
    data,
    currency,
}: {
    data: TYearOverYearRow[];
    currency: TCurrency;
}) => {
    const hasData = data.some(
        (r) =>
            r.current_income > 0 ||
            r.current_expenses > 0 ||
            r.prev_income > 0 ||
            r.prev_expenses > 0,
    );

    if (!hasData) {
        return (
            <div className="flex items-center justify-center border p-4">
                <p className="text-xs text-muted-foreground">No data</p>
            </div>
        );
    }

    return (
        <div className="border p-4">
            <p className="mb-4 text-sm font-medium">
                Year-over-Year ({prevYear} vs {thisYear})
            </p>
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => formatCurrency(v, currency)}
                        width={80}
                    />
                    <ChartTooltip
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="grid min-w-48 gap-1.5 rounded-none border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                    <p className="font-medium">{label}</p>
                                    <div className="grid gap-1">
                                        {payload.map((p, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div
                                                    className="size-2.5 shrink-0 rounded-xs"
                                                    style={{ backgroundColor: p.color }}
                                                />
                                                <div className="flex flex-1 items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        {chartConfig[p.dataKey as keyof typeof chartConfig]?.label}
                                                    </span>
                                                    <span className="font-mono tabular-nums">
                                                        {formatCurrency(Number(p.value), currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="prev_income" fill="var(--color-prev_income)" radius={[2, 2, 0, 0]} maxBarSize={16} />
                    <Bar dataKey="prev_expenses" fill="var(--color-prev_expenses)" radius={[2, 2, 0, 0]} maxBarSize={16} />
                    <Bar dataKey="current_income" fill="var(--color-current_income)" radius={[2, 2, 0, 0]} maxBarSize={16} />
                    <Bar dataKey="current_expenses" fill="var(--color-current_expenses)" radius={[2, 2, 0, 0]} maxBarSize={16} />
                </BarChart>
            </ChartContainer>
        </div>
    );
};
