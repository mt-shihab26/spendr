import type { TCategory } from '@/types/models';
import type { TTransactionListItem } from '@/types/withs';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { formatLocalDateLong, formatLocalDateTime } from '@/lib/date';

import { Link } from '@inertiajs/react';
import { ChevronRight, Trash2, Tag, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { IconBadge } from '@/components/elements/icon-badge';
import { TransactionActions } from '@/components/screens/transactions/transaction-actions';
import { TransactionDeleteDialog } from '@/components/screens/transactions/transaction-delete-dialog';
import { CategorySelect } from '@/components/elements/category-select';

export const TransactionsTable = ({
    transactions,
    categories,
    selectable = false,
}: {
    transactions: TTransactionListItem[];
    categories?: TCategory[];
    selectable?: boolean;
}) => {
    const [toDelete, setToDelete] = useState<TTransactionListItem | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [reassignCategory, setReassignCategory] = useState('');

    const allIds = transactions.map((t) => t.id);
    const allSelected = selected.size === allIds.length && allIds.length > 0;

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(allIds));
    };

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleBulkDelete = () => {
        if (
            !confirm(
                `Delete ${selected.size} transactions? This cannot be undone.`,
            )
        )
            return;
        router.delete(route('transactions.bulk-destroy'), {
            data: { ids: Array.from(selected) },
            onSuccess: () => setSelected(new Set()),
        });
    };

    const handleBulkReassign = () => {
        if (!reassignCategory) return;
        router.patch(
            route('transactions.bulk-reassign'),
            {
                ids: Array.from(selected),
                category_id: reassignCategory,
            },
            {
                onSuccess: () => {
                    setSelected(new Set());
                    setReassignCategory('');
                },
            },
        );
    };

    const transactionsByDate = transactions.reduce<
        Map<string, TTransactionListItem[]>
    >((groups, transaction) => {
        const dateKey = transaction.transacted_at.substring(0, 10);
        const transactionsForDate = groups.get(dateKey) ?? [];
        transactionsForDate.push(transaction);
        groups.set(dateKey, transactionsForDate);
        return groups;
    }, new Map());

    return (
        <>
            {selectable && selected.size > 0 && (
                <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2">
                    <span className="text-xs font-medium">
                        {selected.size} selected
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                        {categories && categories.length > 0 && (
                            <div className="flex items-center gap-1">
                                <CategorySelect
                                    categories={categories}
                                    value={reassignCategory || null}
                                    onValueChange={(v) =>
                                        setReassignCategory(v ?? '')
                                    }
                                    placeholder="Reassign category"
                                    triggerClassName="h-7 w-40 text-xs"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={handleBulkReassign}
                                    disabled={!reassignCategory}
                                >
                                    <Tag className="size-3" />
                                    Apply
                                </Button>
                            </div>
                        )}
                        <Button
                            size="sm"
                            variant="destructive"
                            className="ml-auto h-7 text-xs"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="size-3" />
                            Delete {selected.size}
                        </Button>
                    </div>
                </div>
            )}
            <div className="divide-y border">
                {selectable && (
                    <div className="flex items-center gap-3 bg-muted/30 px-4 py-2">
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={toggleAll}
                        />
                        <span className="text-xs text-muted-foreground">
                            {allSelected ? 'Deselect all' : 'Select all'}
                        </span>
                    </div>
                )}
                {Array.from(transactionsByDate.entries()).map(
                    ([date, groupedTransactions]) => (
                        <div key={date}>
                            <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                                {formatLocalDateLong(date)}
                            </div>
                            <div className="divide-y">
                                {groupedTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        {selectable && (
                                            <Checkbox
                                                checked={selected.has(
                                                    transaction.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggle(transaction.id)
                                                }
                                            />
                                        )}
                                        <IconBadge
                                            icon={transaction.category?.icon}
                                            color={transaction.category?.color}
                                        />
                                        <div className="flex flex-1 flex-col">
                                            <Link
                                                href={route(
                                                    'transactions.show',
                                                    transaction.id,
                                                )}
                                                className="text-xs font-medium hover:underline"
                                            >
                                                {transaction.description}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {transaction.category ? (
                                                    <Link
                                                        href={route(
                                                            'categories.show',
                                                            transaction.category
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transaction.category
                                                                .name
                                                        }
                                                    </Link>
                                                ) : null}
                                                {' · '}
                                                {transaction.wallet && (
                                                    <Link
                                                        href={route(
                                                            'wallets.show',
                                                            transaction.wallet
                                                                .id,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {
                                                            transaction.wallet
                                                                .name
                                                        }
                                                    </Link>
                                                )}
                                            </span>
                                            {transaction.notes && (
                                                <span className="text-xs text-muted-foreground/70 italic">
                                                    {transaction.notes}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatLocalDateTime(
                                                transaction.transacted_at,
                                            )}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
                                            {transaction.type}
                                        </Badge>
                                        <TransactionAmount
                                            transaction={transaction}
                                            className="text-xs font-semibold"
                                        />
                                        {!!transaction.files_count && (
                                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                <Paperclip className="size-3" />
                                                {transaction.files_count}
                                            </span>
                                        )}
                                        <TransactionActions
                                            transaction={transaction}
                                            onDelete={setToDelete}
                                        />
                                        <Link
                                            href={route(
                                                'transactions.edit',
                                                transaction.id,
                                            )}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                )}
            </div>
            {toDelete && (
                <TransactionDeleteDialog
                    transaction={toDelete}
                    open={!!toDelete}
                    onOpenChange={(open) => !open && setToDelete(null)}
                    onDeleted={() => setToDelete(null)}
                />
            )}
        </>
    );
};
