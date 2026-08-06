import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    type ChartConfig,
} from '@/components/ui/chart';

import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
} from 'recharts';

import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

type TCashFlowRow = {
    month: string;
    key: string;
    income: number;
    expenses: number;
    net: number;
};

const chartConfig = {
    income: { label: '+', color: '#22c55e' },
    expenses: { label: '-', color: '#ef4444' },
    net: { label: 'Net', color: '#6366f1' },
} satisfies ChartConfig;

export const CashFlowChart = ({ data, currency }: { data: TCashFlowRow[]; currency: TCurrency }) => {
    const chartData = data.map((row) => ({ ...row, expenses: -row.expenses }));

    return (
        <div className="border p-4">
            <p className="mb-4 text-sm font-medium">Monthly Cash Flow</p>
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
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
                        tickFormatter={(v) => formatCurrency(Math.abs(v), currency)}
                        width={72}
                    />
                    <ChartTooltip
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="grid min-w-40 gap-1.5 rounded-none border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                    <p className="font-medium">{label}</p>
                                    <div className="grid gap-1.5">
                                        {payload
                                            .filter((p) => p.type !== 'none')
                                            .map((p, i) => {
                                                const cfg = chartConfig[p.dataKey as keyof typeof chartConfig];
                                                return (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div
                                                            className="size-2.5 shrink-0 rounded-[2px]"
                                                            style={{ backgroundColor: p.color }}
                                                        />
                                                        <div className="flex flex-1 items-center justify-between gap-4">
                                                            <span className="text-muted-foreground">
                                                                {cfg?.label ?? p.name}
                                                            </span>
                                                            <span className="font-mono font-medium tabular-nums">
                                                                {formatCurrency(Math.abs(Number(p.value)), currency)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={2} maxBarSize={32} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={2} maxBarSize={32} />
                    <Line
                        dataKey="net"
                        stroke="var(--color-net)"
                        strokeWidth={2}
                        dot={false}
                        type="monotone"
                    />
                </ComposedChart>
            </ChartContainer>
        </div>
    );
};
