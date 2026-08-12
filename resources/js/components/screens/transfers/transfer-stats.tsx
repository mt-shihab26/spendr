import type { TCurrency } from '@/types/enums';

import { ArrowLeftRight, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { StatItem } from '@/components/elements/stat-item';
import { TransactionCount } from '@/components/elements/transaction-count';

export type TTransferStat = {
    currency: TCurrency;
    count: number;
    volume: number;
};

export const TransferStats = ({ stats }: { stats: TTransferStat[] }) => {
    return (
        <div className="flex flex-col divide-y border">
            {stats.map(({ currency, count, volume }) => (
                <div key={currency} className="flex items-center px-4 py-3">
                    <div className="flex w-[18%] shrink-0 justify-start">
                        <TransactionCount count={count} label="Transfers" />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden h-8 sm:block"
                    />
                    <div className="flex w-[28%] shrink-0 justify-start px-4">
                        <StatItem
                            icon={ArrowLeftRight}
                            iconClassName="text-blue-500"
                            label="Volume"
                            value={volume}
                            currency={currency}
                        />
                    </div>
                    <div className="ml-auto flex items-center">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium uppercase">
                                {currency}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
