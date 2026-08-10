import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

const PctChange = ({ current, prev }: { current: number; prev: number }) => {
    if (prev === 0) return null;
    const pct = ((current - prev) / prev) * 100;
    const abs = Math.abs(pct).toFixed(1);

    if (pct > 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-income">
                <ArrowUp className="size-3" />
                {abs}% vs last month
            </span>
        );
    }
    if (pct < 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-expense">
                <ArrowDown className="size-3" />
                {abs}% vs last month
            </span>
        );
    }
    return (
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Minus className="size-3" />
            No change vs last month
        </span>
    );
};

const BalanceDelta = ({
    delta,
    currency,
}: {
    delta: number;
    currency: TCurrency;
}) => {
    if (delta > 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-income">
                <ArrowUp className="size-3" />+{formatCurrency(delta, currency)}{' '}
                vs last month
            </span>
        );
    }
    if (delta < 0) {
        return (
            <span className="flex items-center gap-0.5 text-xs text-expense">
                <ArrowDown className="size-3" />
                {formatCurrency(delta, currency)} vs last month
            </span>
        );
    }
    return (
        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Minus className="size-3" />
            No change vs last month
        </span>
    );
};

type TCurrencyStat = {
    currency: TCurrency;
    balance: number;
    month_income: number;
    month_expense: number;
    prev_month_income: number;
    prev_month_expense: number;
    net_worth_delta: number;
};

export const CurrencyStats = ({
    currencyStats,
}: {
    currencyStats: TCurrencyStat[];
}) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            {currencyStats.map((stat) => (
                <div key={stat.currency}>
                    {currencyStats.length > 1 && (
                        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {stat.currency}
                        </p>
                    )}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">
                                Balance
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums">
                                {formatCurrency(stat.balance, stat.currency)}
                            </p>
                            <BalanceDelta
                                delta={stat.net_worth_delta}
                                currency={stat.currency}
                            />
                        </div>
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">
                                This Month Income
                            </p>
                            <p className="mt-1 text-lg font-semibold text-income tabular-nums">
                                {formatCurrency(
                                    stat.month_income,
                                    stat.currency,
                                )}
                            </p>
                            <PctChange
                                current={stat.month_income}
                                prev={stat.prev_month_income}
                            />
                        </div>
                        <div className="border p-4">
                            <p className="text-xs text-muted-foreground">
                                This Month Expenses
                            </p>
                            <p className="mt-1 text-lg font-semibold text-expense tabular-nums">
                                {formatCurrency(
                                    stat.month_expense,
                                    stat.currency,
                                )}
                            </p>
                            <PctChange
                                current={stat.month_expense}
                                prev={stat.prev_month_expense}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
