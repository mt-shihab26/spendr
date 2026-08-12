import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TPaginated, TTransactionType } from '@/types/utils';
import type { TWallet, TCategory } from '@/types/models';
import type { TTransactionListItem, TTransactionStat } from '@/types/withs';

import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { InfiniteScroll } from '@inertiajs/react';
import { ArrowRightLeft, Download, ListChecks, Upload, X } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { Button } from '@/components/ui/button';
import { TransactionStats } from '@/components/screens/transactions/transaction-stats';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';
import { EmptyState } from '@/components/elements/empty-state';

type TFilters = {
    type: TTransactionType;
    wallet_id: string | null;
    category_id: string | null;
    date_from: string | null;
    date_to: string | null;
};

const TransactionsIndex = ({
    transactions,
    wallets,
    categories,
    filters,
    stats,
}: {
    transactions: TPaginated<TTransactionListItem>;
    wallets: TWallet[];
    categories: TCategory[];
    filters: TFilters;
    stats: TTransactionStat[];
}) => {
    const [bulkMode, setBulkMode] = useState(false);

    const navigate = (params: Partial<TFilters>) => {
        router.get(
            route('transactions.index'),
            { ...filters, ...params },
            { preserveScroll: true, replace: true },
        );
    };

    const hasFilters =
        filters.type !== 'all' ||
        !!filters.wallet_id ||
        !!filters.category_id ||
        !!filters.date_from ||
        !!filters.date_to;

    const clearFilters = () => {
        router.get(route('transactions.index'), {}, { replace: true });
    };

    const exportUrl = (() => {
        const params = new URLSearchParams();
        if (filters.type !== 'all') params.set('type', filters.type);
        if (filters.wallet_id) params.set('wallet_id', filters.wallet_id);
        if (filters.category_id) params.set('category_id', filters.category_id);
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        const qs = params.toString();
        return `${route('transactions.export')}${qs ? `?${qs}` : ''}`;
    })();

    const categoryType = filters.type !== 'all' ? filters.type : undefined;

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

                <div className="flex flex-wrap items-center gap-2">
                    <Select
                        value={filters.type}
                        onValueChange={(value) =>
                            navigate({
                                type: value as TTransactionType,
                                category_id: null,
                            })
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="w-40">
                        <WalletSelect
                            wallets={wallets}
                            value={filters.wallet_id}
                            onValueChange={(value) =>
                                navigate({ wallet_id: value || null })
                            }
                            includeAll
                        />
                    </div>
                    <div className="w-44">
                        <CategorySelect
                            categories={categories}
                            type={categoryType}
                            value={filters.category_id}
                            onValueChange={(value) =>
                                navigate({ category_id: value || null })
                            }
                            includeAll
                        />
                    </div>
                    <DateRangePicker
                        dateFrom={filters.date_from}
                        dateTo={filters.date_to}
                        onSelect={(dates) =>
                            navigate({
                                date_from: dates?.from ?? null,
                                date_to: dates?.to ?? null,
                            })
                        }
                        onClear={() =>
                            navigate({ date_from: null, date_to: null })
                        }
                    />
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 gap-1 text-xs"
                        >
                            <X className="size-3" />
                            Clear filters
                        </Button>
                    )}
                </div>

                {stats.length > 0 && <TransactionStats stats={stats} />}

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
