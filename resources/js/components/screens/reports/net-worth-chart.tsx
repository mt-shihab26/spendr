import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
} from '@/components/ui/chart';

import type { TCurrency } from '@/types/enums';
import type { ChartConfig } from '@/components/ui/chart';
import type { TNetWorthRow } from '@/types/reports';

import { formatCurrency } from '@/lib/formats';

const chartConfig = {
    net_worth: { label: 'Net Worth', color: '#6366f1' },
} satisfies ChartConfig;

export const NetWorthChart = ({
    data,
    currency,
}: {
    data: TNetWorthRow[];
    currency: TCurrency;
}) => {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center border p-4">
                <p className="text-xs text-muted-foreground">No data</p>
            </div>
        );
    }

    return (
        <div className="border p-4">
            <p className="mb-4 text-sm font-medium">Net Worth Over Time</p>
            <ChartContainer config={chartConfig} className="h-48 w-full">
                <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
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
                                <div className="rounded-none border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                    <p className="mb-1 font-medium">{label}</p>
                                    <p className="font-mono tabular-nums">
                                        {formatCurrency(Number(payload[0]?.value), currency)}
                                    </p>
                                </div>
                            );
                        }}
                    />
                    <Area
                        dataKey="net_worth"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#netWorthGradient)"
                        type="monotone"
                        dot={false}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
};
