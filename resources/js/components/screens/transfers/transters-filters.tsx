import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { WalletSelect } from '@/components/elements/wallet-select';
import { XIcon } from 'lucide-react';

export type TFilters = {
    wallet_id: string | null;
    date_from: string | null;
    date_to: string | null;
};

export const TransfersFilters = ({
    filters,
    wallets,
}: {
    filters: TFilters;
    wallets: TWallet[];
}) => {
    const navigate = (params: Partial<TFilters>) => {
        const merged = { ...filters, ...params };
        const query = Object.fromEntries(
            Object.entries(merged).filter(
                ([, value]) => value !== null && value !== '',
            ),
        );

        router.get(route('transfers.index'), query, {
            preserveScroll: true,
            replace: true,
        });
    };

    const hasFilters =
        !!filters.wallet_id || !!filters.date_from || !!filters.date_to;

    const clearFilters = () => {
        router.get(route('transfers.index'), {}, { replace: true });
    };

    return (
        <div className="flex items-center gap-2">
            <div>
                <DateRangePicker
                    dateFrom={filters.date_from}
                    dateTo={filters.date_to}
                    onClear={() => navigate({ date_from: null, date_to: null })}
                    onSelect={(dates) =>
                        navigate({
                            date_from: dates?.from ?? null,
                            date_to: dates?.to ?? null,
                        })
                    }
                />
            </div>
            <div>
                <WalletSelect
                    wallets={wallets}
                    value={filters.wallet_id}
                    includeAll
                    onValueChange={(value) =>
                        navigate({ wallet_id: value || null })
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
