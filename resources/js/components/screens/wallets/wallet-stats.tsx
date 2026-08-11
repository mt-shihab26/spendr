import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { ProfitLossBadge } from '@/components/elements/profit-loss-badge';

export type TStatWallet = {
    currency: TCurrency;
    initial_balance?: number;
    income: number;
    expense: number;
    net: number;
    balance?: number;
    transfers_out?: number;
    transfers_in?: number;
};

const StatCell = ({
    label,
    value,
    currency,
    className,
}: {
    label: string;
    value: number;
    currency: TCurrency;
    className?: string;
}) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-sm font-medium tabular-nums ${className ?? ''}`}>
            {formatCurrency(value, currency)}
        </span>
    </div>
);

export const WalletStats = ({ stats }: { stats: TStatWallet[] }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {stats.map(
                ({
                    currency,
                    income,
                    expense,
                    net,
                    balance,
                    transfers_in,
                    transfers_out,
                }) => {
                    const hasTransfers =
                        (transfers_in ?? 0) > 0 || (transfers_out ?? 0) > 0;

                    return (
                        <div
                            key={currency}
                            className="flex flex-col gap-4 border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">
                                    {currency}
                                </span>
                                <ProfitLossBadge net={net} />
                            </div>

                            {balance !== undefined && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground">
                                        Total Balance
                                    </span>
                                    <span className="text-2xl font-bold text-balance tabular-nums">
                                        {formatCurrency(balance, currency)}
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3 border-t pt-4">
                                <StatCell
                                    label="Income"
                                    value={income}
                                    currency={currency}
                                    className="text-income"
                                />
                                <StatCell
                                    label="Expenses"
                                    value={expense}
                                    currency={currency}
                                    className="text-expense"
                                />
                                <StatCell
                                    label="Net"
                                    value={net}
                                    currency={currency}
                                    className={
                                        net >= 0
                                            ? 'text-income'
                                            : 'text-expense'
                                    }
                                />
                            </div>

                            {hasTransfers && (
                                <div className="flex gap-6 border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        <ArrowDownLeft className="size-3.5 text-income" />
                                        <StatCell
                                            label="Transfers In"
                                            value={transfers_in ?? 0}
                                            currency={currency}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowUpRight className="size-3.5 text-expense" />
                                        <StatCell
                                            label="Transfers Out"
                                            value={transfers_out ?? 0}
                                            currency={currency}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                },
            )}
        </div>
    );
};
