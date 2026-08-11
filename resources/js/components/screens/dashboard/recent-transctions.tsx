import type { TTransaction } from '@/types/models';

import { ViewAllLink } from '@/components/elements/view-all-link';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';

export const RecentTransactions = ({
    recentTransactions,
}: {
    recentTransactions: TTransaction[];
}) => {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Recent Transactions</p>
                <ViewAllLink href={route('transactions.index')}>
                    View All
                </ViewAllLink>
            </div>
            {recentTransactions.length === 0 ? (
                <div className="border p-4">
                    <p className="text-xs text-muted-foreground">
                        No transactions yet.
                    </p>
                </div>
            ) : (
                <TransactionsTable transactions={recentTransactions} />
            )}
        </div>
    );
};
