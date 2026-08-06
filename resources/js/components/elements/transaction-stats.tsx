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
        <div className="flex flex-col gap-1">
            {stats.map(({ currency, income, expense }) => {
                const net = income - expense;

                return (
                    <div
                        key={currency}
                        className="flex items-center gap-3 text-sm"
                    >
                        <span className="flex items-center gap-1 font-medium text-green-600">
                            <Plus className="size-3" />
                            {formatCurrency(income, currency)}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-red-500">
                            <Minus className="size-3" />
                            {formatCurrency(expense, currency)}
                        </span>
                        <span
                            className={`flex items-center gap-1 font-medium ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}
                        >
                            <Equal className="size-3" />
                            {formatCurrency(net, currency)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
