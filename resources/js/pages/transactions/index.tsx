import type { TPaginated } from '@/types/utils';
import type { TWallet, TCategory } from '@/types/models';
import type { TTransactionListItem, TTransactionStat } from '@/types/withs';
import type { TFilters } from '@/components/screens/transactions/transactions-filters';

import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { InfiniteScroll } from '@inertiajs/react';
import { ArrowRightLeft, Download, ListChecks, Upload } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransactionStats } from '@/components/screens/transactions/transaction-stats';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { EmptyState } from '@/components/elements/empty-state';
import { TransactionsFilters } from '@/components/screens/transactions/transactions-filters';

const TransactionsIndex = ({
    filters,
    wallets,
    categories,
    stats,
    transactions,
}: {
    filters: TFilters;
    wallets: TWallet[];
    categories: TCategory[];
    stats: TTransactionStat[];
    transactions: TPaginated<TTransactionListItem>;
}) => {
    const [bulkMode, setBulkMode] = useState(false);

    const exportUrl = (() => {
        const params = new URLSearchParams();
        if (filters.type) params.set('type', filters.type);
        if (filters.wallet_id) params.set('wallet_id', filters.wallet_id);
        if (filters.category_id) params.set('category_id', filters.category_id);
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        const qs = params.toString();
        return `${route('transactions.export')}${qs ? `?${qs}` : ''}`;
    })();

    const title = `Transactions (${transactions.total})`;

    return (
        <AppLayout
            title={title}
            description="Track your income and expenses"
            breadcrumbs={[
                { title: 'Transactions', route: 'transactions.index' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={title}
                        description="Track your income and expenses"
                    />
                    <NewButton href={route('transactions.create')}>
                        New Transaction
                    </NewButton>
                </div>
                <TransactionsFilters
                    filters={filters}
                    wallets={wallets}
                    categories={categories}
                />
                <TransactionStats stats={stats} />
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Showing {transactions.total} transactions
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setBulkMode((v) => !v)}
                            className={`flex items-center gap-1 text-xs hover:text-foreground ${bulkMode ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            <ListChecks className="size-3" />
                            {bulkMode ? 'Exit bulk' : 'Bulk select'}
                        </button>
                        <Link
                            href={route('transactions.import')}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <Upload className="size-3" />
                            Import
                        </Link>
                        <a
                            href={exportUrl}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <Download className="size-3" />
                            CSV
                        </a>
                    </div>
                </div>
                {transactions.data.length === 0 ? (
                    <EmptyState
                        icon={<ArrowRightLeft />}
                        title="No transactions yet"
                        description="Record your first income or expense to start tracking your finances."
                        href={route('transactions.create')}
                        action="Record first transaction"
                    />
                ) : (
                    <InfiniteScroll data="transactions" onlyNext preserveUrl>
                        <TransactionsTable
                            transactions={transactions.data}
                            categories={categories}
                            selectable={bulkMode}
                        />
                    </InfiniteScroll>
                )}
            </div>
        </AppLayout>
    );
};

export default TransactionsIndex;
