import type { TWallet, TCategory } from '@/types/models';
import type { TType } from '@/types/enums';

import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';
import { TypeSelect } from '@/components/elements/type-select';
import { XIcon } from 'lucide-react';

export type TFilters = {
    type: TType | null;
    wallet_id: string | null;
    category_id: string | null;
    date_from: string | null;
    date_to: string | null;
};

export const TransactionsFilters = ({
    filters,
    wallets,
    categories,
}: {
    filters: TFilters;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    const navigate = (params: Partial<TFilters>) => {
        const merged = { ...filters, ...params };
        const query = Object.fromEntries(
            Object.entries(merged).filter(
                ([, value]) => value !== null && value !== '',
            ),
        );

        router.get(route('transactions.index'), query, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasFilters =
        !!filters.type ||
        !!filters.wallet_id ||
        !!filters.category_id ||
        !!filters.date_from ||
        !!filters.date_to;

    const clearFilters = () => {
        router.get(route('transactions.index'), {}, { replace: true });
    };

    const categoryType = filters.type ?? undefined;

    return (
        <div className="flex items-center gap-2">
            <div>
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
                        navigate({
                            date_from: null,
                            date_to: null,
                        })
                    }
                />
            </div>
            <div>
                <TypeSelect
                    includeAll
                    value={filters.type}
                    onValueChange={(value) =>
                        navigate({ type: value, category_id: null })
                    }
                />
            </div>
            <div>
                <WalletSelect
                    includeAll
                    wallets={wallets}
                    value={filters.wallet_id}
                    onValueChange={(value) =>
                        navigate({ wallet_id: value || null })
                    }
                />
            </div>
            <div>
                <CategorySelect
                    includeAll
                    categories={categories}
                    type={categoryType}
                    value={filters.category_id}
                    onValueChange={(value) =>
                        navigate({ category_id: value || null })
                    }
                />
            </div>
            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 gap-1 text-xs"
                >
                    <XIcon className="size-3" />
                    Clear filters
                </Button>
            )}
        </div>
    );
};
