import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';
import { ViewAllLink } from '@/components/elements/view-all-link';

export type TSpendingCategory = {
    name: string;
    color: string;
    total: Record<string, number>;
    percentage: Record<string, number>;
};

export const TopSpendingByCategory = ({
    spendingCategories,
}: {
    spendingCategories: TSpendingCategory[];
}) => {
    return (
        <div className="flex-1 border p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Top Spending by Category</p>
                <ViewAllLink href={route('categories.index')}>
                    All Categories
                </ViewAllLink>
            </div>
            {spendingCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">No data</p>
            ) : (
                <ul className="divide-y">
                    {spendingCategories.map((item) => (
                        <li
                            key={item.name}
                            className="flex items-center gap-2 py-2"
                        >
                            <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="min-w-0 flex-1 truncate text-xs">
                                {item.name}
                            </span>
                            <div className="flex flex-col items-end gap-0.5">
                                {Object.entries(item.total).map(
                                    ([currency, amount]) => (
                                        <span
                                            key={currency}
                                            className="text-xs tabular-nums"
                                        >
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    amount,
                                                    currency as TCurrency,
                                                )}
                                            </span>
                                            <span className="ml-1 text-muted-foreground">
                                                {item.percentage[currency]}%
                                            </span>
                                        </span>
                                    ),
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
