import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

import { Cell, Pie, PieChart } from 'recharts';

import { formatCurrency } from '@/lib/formats';

type TCategoryRow = {
    name: string;
    color: string;
    total: number;
    percentage: number;
};

export const CategoryDonut = ({
    title,
    data,
}: {
    title: string;
    data: TCategoryRow[];
}) => {
    const chartConfig = Object.fromEntries(
        data.map((d) => [d.name, { label: d.name, color: d.color }]),
    ) satisfies ChartConfig;

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center border p-4">
                <p className="mb-4 self-start text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">No data</p>
            </div>
        );
    }

    return (
        <div className="border p-4">
            <p className="mb-2 text-sm font-medium">{title}</p>
            <div className="flex items-center gap-6">
                <ChartContainer config={chartConfig} className="h-40 w-40 shrink-0">
                    <PieChart>
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
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="name"
                            innerRadius="55%"
                            outerRadius="80%"
                            strokeWidth={0}
                        >
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <ul className="flex flex-1 flex-col gap-1.5 overflow-hidden">
                    {data.map((item) => (
                        <li key={item.name} className="flex items-center gap-2 text-xs">
                            <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="min-w-0 flex-1 truncate text-muted-foreground">
                                {item.name}
                            </span>
                            <span className="shrink-0 text-muted-foreground">
                                {item.percentage}%
                            </span>
                            <span className="shrink-0 font-medium tabular-nums">
                                {formatCurrency(item.total)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
