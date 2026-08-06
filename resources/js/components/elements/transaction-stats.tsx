import { Plus, Minus, Equal } from 'lucide-react';

import { formatCurrency } from '@/lib/formats';

export const TransactionStats = ({
    income,
    expense,
}: {
    income: number;
    expense: number;
}) => {
    const net = income - expense;

    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-medium text-green-600">
                <Plus className="size-3" />
                {formatCurrency(income)}
            </span>
            <span className="flex items-center gap-1 font-medium text-red-500">
                <Minus className="size-3" />
                {formatCurrency(expense)}
            </span>
            <span
                className={`flex items-center gap-1 font-medium ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
                <Equal className="size-3" />
                {formatCurrency(net)}
            </span>
        </div>
    );
};
