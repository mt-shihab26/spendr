import type { TTransactionListItem } from '@/types/withs';

import { formatCurrency } from '@/lib/formats';
import { cn } from '@/lib/utils';

export const TransactionAmount = ({
    transaction,
    className,
}: {
    transaction: TTransactionListItem;
    className?: string;
}) => {
    const isIncome = transaction.type === 'income';

    return (
        <span
            className={cn(
                'tabular-nums',
                isIncome ? 'text-green-600' : 'text-red-500',
                className,
            )}
        >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, transaction.wallet?.currency)}
        </span>
    );
};
