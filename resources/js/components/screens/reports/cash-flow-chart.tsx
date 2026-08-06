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

import { formatCurrency } from '@/lib/formats';

type TCashFlowRow = {
    month: string;
    key: string;
    income: number;
    expenses: number;
    net: number;
};

const chartConfig = {
    income: { label: 'Income', color: '#22c55e' },
    expenses: { label: 'Expenses', color: '#ef4444' },
    net: { label: 'Net', color: '#6366f1' },
} satisfies ChartConfig;

export const CashFlowChart = ({ data }: { data: TCashFlowRow[] }) => {
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
                        tickFormatter={(v) => formatCurrency(v)}
                        width={72}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) => [
                                    formatCurrency(Number(value)),
                                    name,
                                ]}
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
