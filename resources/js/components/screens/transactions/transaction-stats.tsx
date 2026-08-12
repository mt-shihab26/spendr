import type { TTransactionStat } from '@/types/withs';

import { Separator } from '@/components/ui/separator';
import { TransactionCount } from '@/components/elements/transaction-count';
import { Income } from '@/components/elements/income';
import { Expense } from '@/components/elements/expense';
import { Net } from '@/components/elements/net';

export const TransactionStats = ({ stats }: { stats: TTransactionStat[] }) => {
    return (
        <div className="flex flex-col divide-y border">
            {stats.map(({ currency, count, income, expense, net }) => (
                <div key={currency} className="flex items-center px-4 py-3">
                    <div className="flex w-[18%] shrink-0 justify-start">
                        <TransactionCount count={count} />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden h-8 sm:block"
                    />
                    <div className="flex w-[28%] shrink-0 justify-start px-4">
                        <div className="w-1/2">
                            <Income income={income} currency={currency} />
                        </div>
                        <div className="w-1/2">
                            <Expense expense={expense} currency={currency} />
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <Separator
                            orientation="vertical"
                            className="hidden h-8 sm:block"
                        />
                        <div className="flex min-w-24 justify-start">
                            <Net net={net} currency={currency} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
