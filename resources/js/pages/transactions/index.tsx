import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TPaginated, TTransactionType } from '@/types/utils';
import type { TTransaction, TWallet, TCategory } from '@/types/models';
import type { TStat } from '@/components/elements/currency-stats';

import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { InfiniteScroll } from '@inertiajs/react';
import { ArrowRightLeft, Download, X } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyStats } from '@/components/elements/currency-stats';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';

type TFilters = {
    type: TTransactionType;
    search: string | null;
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
    transactions: TPaginated<TTransaction>;
    wallets: TWallet[];
    categories: TCategory[];
    filters: TFilters;
    stats: TStat[];
}) => {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                navigate({ search: search || null });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const navigate = (params: Partial<TFilters>) => {
        router.get(
            route('transactions.index'),
            { ...filters, ...params },
            { preserveScroll: true, replace: true },
        );
    };

    const hasFilters =
        !!filters.search ||
        filters.type !== 'all' ||
        !!filters.wallet_id ||
        !!filters.category_id ||
        !!filters.date_from ||
        !!filters.date_to;

    const clearFilters = () => {
        setSearch('');
        router.get(route('transactions.index'), {}, { replace: true });
    };

    const exportUrl = (() => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.type !== 'all') params.set('type', filters.type);
        if (filters.wallet_id) params.set('wallet_id', filters.wallet_id);
        if (filters.category_id) params.set('category_id', filters.category_id);
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        const qs = params.toString();
        return `${route('transactions.export')}${qs ? `?${qs}` : ''}`;
    })();

    const categoryType = filters.type !== 'all' ? filters.type : undefined;

    return (
        <AppLayout
            title="Transactions"
            description="Track your income and expenses"
            breadcrumbs={[
                { title: 'Transactions', route: 'transactions.index' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Transactions (${transactions.total})`}
                        description="Track your income and expenses"
                    />
                    <NewButton href={route('transactions.create')}>
                        New Transaction
                    </NewButton>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        className="w-40"
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        value={filters.type}
                        onValueChange={(value) =>
                            navigate({ type: value as TTransactionType, category_id: null })
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

                {stats.length > 0 && <CurrencyStats stats={stats} />}

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Showing {transactions.total} transactions
                    </p>
                    <a
                        href={exportUrl}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Download className="size-3" />
                        CSV
                    </a>
                </div>

                {transactions.data.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <ArrowRightLeft />
                            </EmptyMedia>
                            <EmptyTitle>No transactions yet</EmptyTitle>
                            <EmptyDescription>
                                Record your first income or expense to start
                                tracking your finances.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('transactions.create')}>
                            Record first transaction
                        </NewButton>
                    </Empty>
                ) : (
                    <InfiniteScroll data="transactions" onlyNext preserveUrl>
                        <TransactionsTable transactions={transactions.data} />
                    </InfiniteScroll>
                )}
            </div>
        </AppLayout>
    );
};

export default TransactionsIndex;
