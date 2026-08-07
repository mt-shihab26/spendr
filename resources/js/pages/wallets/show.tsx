import type { TWallet, TTransaction } from '@/types/models';
import type { TPaginated, TTransactionType } from '@/types/utils';

import { formatCurrency } from '@/lib/formats';
import { getCurrencySymbol } from '@/lib/currency';
import { getIcon } from '@/lib/icons';

import { router } from '@inertiajs/react';
import { InfiniteScroll } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { MonthPicker } from '@/components/elements/month-picker';
import { TransactionsTable } from '@/components/screens/transactions/transactions-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WalletsShow = ({
    wallet,
    transactions,
    month,
    type,
}: {
    wallet: TWallet;
    transactions: TPaginated<TTransaction>;
    month: string;
    type: TTransactionType;
}) => {
    const navigate = (params: { month?: string; type?: string }) => {
        router.get(
            route('wallets.show', wallet.id),
            { month, type, ...params },
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout
            title={wallet.name}
            description={wallet.name}
            breadcrumbs={[
                {
                    title: 'Wallets',
                    route: 'wallets.index',
                },
                {
                    title: wallet.name,
                    route: 'wallets.show',
                    params: { wallet: wallet.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={wallet.name}
                        description={`${getCurrencySymbol(wallet.currency)} ${wallet.currency}${wallet.is_default ? ' · Default wallet' : ''}`}
                        icon={getIcon(wallet.icon)}
                        color={wallet.color}
                    />
                    <div className="flex items-center">
                        <EditButton href={route('wallets.edit', wallet.id)} />
                        <BackButton href={route('wallets.index')} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="mt-1 text-lg font-semibold text-balance tabular-nums">
                            {formatCurrency(wallet.balance ?? 0, wallet.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Month Income</p>
                        <p className="mt-1 text-lg font-semibold text-income tabular-nums">
                            {formatCurrency(wallet.month_income ?? 0, wallet.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Month Expenses</p>
                        <p className="mt-1 text-lg font-semibold text-expense tabular-nums">
                            {formatCurrency(wallet.month_expense ?? 0, wallet.currency)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <MonthPicker
                        month={month}
                        href={route('wallets.show', wallet.id)}
                        extraParams={{ type }}
                    />
                    <Tabs
                        value={type}
                        onValueChange={(value) => navigate({ type: value })}
                    >
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="income">Income</TabsTrigger>
                            <TabsTrigger value="expense">Expense</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {transactions.data.length > 0 ? (
                    <InfiniteScroll data="transactions" onlyNext preserveUrl>
                        <TransactionsTable transactions={transactions.data} />
                    </InfiniteScroll>
                ) : (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            No transactions for this month.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default WalletsShow;
