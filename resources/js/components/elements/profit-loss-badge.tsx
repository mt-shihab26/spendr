import { TrendingUp, TrendingDown } from 'lucide-react';

export const ProfitLossBadge = ({ net }: { net: number }) => {
    const isProfit = net >= 0;

    return (
        <div
            className={`flex items-center gap-1.5 text-sm font-medium ${isProfit ? 'text-income' : 'text-expense'}`}
        >
            {isProfit ? (
                <TrendingUp className="size-4" />
            ) : (
                <TrendingDown className="size-4" />
            )}
            {isProfit ? 'Profit' : 'Loss'}
        </div>
    );
};
