import type { TCurrency } from '@/types/enums';

import { RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { StatItem } from '@/components/elements/stat-item';
import { TransactionCount } from '@/components/elements/transaction-count';

export type TRecurringTransactionStat = {
    currency: TCurrency;
    total: number;
    active: number;
    amount: number;
};

export const RecurringTransactionStats = ({
    stats,
}: {
    stats: TRecurringTransactionStat[];
}) => {
    return (
        <div className="flex flex-col divide-y border">
            {stats.map(({ currency, total, active, amount }) => {
                const paused = total - active;
                return (
                    <div key={currency} className="flex items-center px-4 py-3">
                        <div className="flex w-[18%] shrink-0 justify-start">
                            <TransactionCount count={total} label="Recurring" />
                        </div>
                        <Separator
                            orientation="vertical"
                            className="hidden h-8 sm:block"
                        />
                        <div className="flex w-[28%] shrink-0 items-center gap-3 px-4">
                            <div className="flex items-center gap-1.5 text-xs">
                                <Badge variant="secondary" className="text-xs">
                                    {active} Active
                                </Badge>
                                {paused > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        {paused} Paused
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Separator
                            orientation="vertical"
                            className="hidden h-8 sm:block"
                        />
                        <div className="flex w-[28%] shrink-0 justify-start px-4">
                            <StatItem
                                icon={RefreshCw}
                                iconClassName="text-blue-500"
                                label="Total Amount"
                                value={amount}
                                currency={currency}
                            />
                        </div>
                        <div className="ml-auto flex items-center">
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                                {currency}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
