import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
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
    return (
        <div className="border p-4">
            <p className="mb-4 text-sm font-medium">Monthly Cash Flow</p>
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
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
                        width={72}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name, item) => {
                                    const label = chartConfig[name as keyof typeof chartConfig]?.label ?? String(name);
                                    const color = (item as any).color ?? (item as any).payload?.fill;
                                    return (
                                        <>
                                            <div
                                                className="size-2.5 shrink-0 rounded-[2px]"
                                                style={{ backgroundColor: color }}
                                            />
                                            <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                                                <span className="text-muted-foreground">{label}</span>
                                                <span className="font-mono font-medium tabular-nums">
                                                    {formatCurrency(Number(value), currency)}
                                                </span>
                                            </div>
                                        </>
                                    );
                                }}
                            />
                        }
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
