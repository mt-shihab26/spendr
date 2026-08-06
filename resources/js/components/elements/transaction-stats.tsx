import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { Plus, Minus, Equal } from 'lucide-react';

export type TStat = {
    currency: TCurrency;
    income: number;
    expense: number;
};

export const TransactionStats = ({ stats }: { stats: TStat[] }) => {
    return (
        <div className="flex flex-col items-end gap-1">
            {stats.map(({ currency, income, expense }) => {
                const net = income - expense;

                return (
                    <div
                        key={currency}
                        className="flex items-center gap-3 text-sm"
                    >
                        <span className="flex items-center gap-1 font-medium">
                            <Plus className="size-3 text-green-600" />
                            {formatCurrency(income, currency)}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                            <Minus className="size-3 text-red-500" />
                            {formatCurrency(expense, currency)}
                        </span>
                        <span className={`flex items-center gap-1 font-medium`}>
                            <Equal
                                className={`size-3 ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}
                            />
                            {formatCurrency(net, currency)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
