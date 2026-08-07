import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { ProfitLossBadge } from '@/components/elements/profit-loss-badge';

export type TStat = {
    currency: TCurrency;
    initial_balance?: number;
    income: number;
    expense: number;
    net: number;
    balance?: number;
    transfers_out?: number;
    transfers_in?: number;
};

export const CurrencyStats = ({ stats }: { stats: TStat[] }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {stats.map(
                ({ currency, initial_balance, income, expense, net }) => {
                    return (
                        <div key={currency} className="border p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {currency}
                                </span>
                                <ProfitLossBadge net={net} />
                            </div>
                            <div className="mt-3 flex items-end justify-between gap-4 text-xs">
                                {initial_balance !== undefined && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground">
                                            Initial
                                        </span>
                                        <span className="text-sm font-medium text-initial-balance tabular-nums">
                                            {formatCurrency(
                                                initial_balance,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">
                                        Income
                                    </span>
                                    <span className="text-sm font-medium text-income tabular-nums">
                                        {formatCurrency(income, currency)}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">
                                        Expenses
                                    </span>
                                    <span className="text-sm font-medium text-expense tabular-nums">
                                        {formatCurrency(expense, currency)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-muted-foreground">
                                        Net
                                    </span>
                                    <span className="text-sm font-medium text-net tabular-nums">
                                        {formatCurrency(net, currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                },
            )}
        </div>
    );
};
