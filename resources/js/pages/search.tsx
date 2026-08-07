import type {
    TCategory,
    TGoal,
    TRecurringTransaction,
    TTransaction,
    TTransfer,
    TWallet,
} from '@/types/models';

import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { RefreshCw, Target } from 'lucide-react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { IconBadge } from '@/components/elements/icon-badge';

import { formatCurrency } from '@/lib/formats';
import { formatLocalDate } from '@/lib/date';
import { getIcon } from '@/lib/icons';

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
        </p>
        <div className="divide-y border">{children}</div>
    </div>
);

const Search = ({
    query,
    transactions,
    wallets,
    transfers,
    categories,
    goals,
    recurring,
}: {
    query: string;
    transactions: TTransaction[];
    wallets: TWallet[];
    transfers: TTransfer[];
    categories: TCategory[];
    goals: TGoal[];
    recurring: TRecurringTransaction[];
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = inputRef.current?.value ?? '';
        router.get(route('search'), { q }, { preserveScroll: true, replace: true });
    };

    const totalResults =
        transactions.length +
        wallets.length +
        transfers.length +
        categories.length +
        goals.length +
        recurring.length;

    return (
        <AppLayout
            title="Search"
            description="Search across your financial data"
            breadcrumbs={[{ title: 'Search', route: 'search' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title="Search"
                    description="Search across your financial data"
                />

                <form onSubmit={handleSearch}>
                    <input
                        ref={inputRef}
                        type="text"
                        defaultValue={query}
                        placeholder="Search transactions, wallets, goals, recurring…"
                        className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                </form>

                {query && (
                    <p className="text-xs text-muted-foreground">
                        {totalResults} result{totalResults !== 1 ? 's' : ''}{' '}
                        for &quot;{query}&quot;
                    </p>
                )}

                {query && totalResults === 0 && (
                    <div className="border p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No results found.
                        </p>
                    </div>
                )}

                {transactions.length > 0 && (
                    <Section title="Transactions">
                        {transactions.map((tx) => (
                            <Link
                                key={tx.id}
                                href={route('transactions.show', tx.id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                            >
                                <IconBadge
                                    icon={tx.category?.icon}
                                    color={tx.category?.color}
                                />
                                <div className="flex flex-1 flex-col">
                                    <span className="text-xs font-medium">
                                        {tx.description}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {tx.category?.name} · {tx.wallet?.name}{' '}
                                        · {formatLocalDate(tx.transacted_at)}
                                    </span>
                                </div>
                                <TransactionAmount
                                    transaction={tx}
                                    className="text-xs font-semibold"
                                />
                            </Link>
                        ))}
                    </Section>
                )}

                {wallets.length > 0 && (
                    <Section title="Wallets">
                        {wallets.map((wallet) => {
                            const Icon = getIcon(wallet.icon);
                            return (
                                <Link
                                    key={wallet.id}
                                    href={route('wallets.show', wallet.id)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                                >
                                    <span
                                        className="flex size-8 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: wallet.color }}
                                    >
                                        {Icon && (
                                            <Icon className="size-4 text-white" />
                                        )}
                                    </span>
                                    <span className="flex-1 text-xs font-medium">
                                        {wallet.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {wallet.currency}
                                    </span>
                                </Link>
                            );
                        })}
                    </Section>
                )}

                {transfers.length > 0 && (
                    <Section title="Transfers">
                        {transfers.map((transfer) => (
                            <Link
                                key={transfer.id}
                                href={route('transfers.show', transfer.id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                            >
                                <div className="flex flex-1 flex-col">
                                    <span className="text-xs font-medium">
                                        {transfer.from_wallet?.name} →{' '}
                                        {transfer.to_wallet?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatLocalDate(transfer.transacted_at)}
                                        {transfer.notes &&
                                            ` · ${transfer.notes}`}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold tabular-nums">
                                    {formatCurrency(
                                        transfer.amount,
                                        transfer.from_wallet?.currency,
                                    )}
                                </span>
                            </Link>
                        ))}
                    </Section>
                )}

                {categories.length > 0 && (
                    <Section title="Categories">
                        {categories.map((category) => {
                            const Icon = getIcon(category.icon);
                            return (
                                <Link
                                    key={category.id}
                                    href={route('categories.show', category.id)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                                >
                                    <span
                                        className="flex size-8 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        {Icon && (
                                            <Icon className="size-4 text-white" />
                                        )}
                                    </span>
                                    <span className="flex-1 text-xs font-medium">
                                        {category.name}
                                    </span>
                                    <span className="text-xs capitalize text-muted-foreground">
                                        {category.type}
                                    </span>
                                </Link>
                            );
                        })}
                    </Section>
                )}

                {goals.length > 0 && (
                    <Section title="Goals">
                        {goals.map((goal) => {
                            const pct = goal.progress_percentage ?? 0;
                            return (
                                <Link
                                    key={goal.id}
                                    href={route('goals.show', goal.id)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                                >
                                    <span
                                        className="flex size-8 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: goal.color + '20',
                                            color: goal.color,
                                        }}
                                    >
                                        <Target className="size-4" />
                                    </span>
                                    <div className="flex flex-1 flex-col">
                                        <span className="text-xs font-medium">
                                            {goal.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatCurrency(
                                                goal.current_amount,
                                                goal.currency,
                                            )}{' '}
                                            /{' '}
                                            {formatCurrency(
                                                goal.target_amount,
                                                goal.currency,
                                            )}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold tabular-nums">
                                        {pct.toFixed(0)}%
                                    </span>
                                </Link>
                            );
                        })}
                    </Section>
                )}

                {recurring.length > 0 && (
                    <Section title="Recurring Transactions">
                        {recurring.map((r) => (
                            <Link
                                key={r.id}
                                href={route('recurring-transactions.show', r.id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                    <RefreshCw className="size-4 text-muted-foreground" />
                                </span>
                                <div className="flex flex-1 flex-col">
                                    <span className="text-xs font-medium">
                                        {r.description}
                                    </span>
                                    <span className="text-xs capitalize text-muted-foreground">
                                        {r.frequency} · next {r.next_due_at}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold tabular-nums">
                                    {r.wallet
                                        ? formatCurrency(
                                              r.amount,
                                              r.wallet.currency,
                                          )
                                        : r.amount.toFixed(2)}
                                </span>
                            </Link>
                        ))}
                    </Section>
                )}
            </div>
        </AppLayout>
    );
};

export default Search;
