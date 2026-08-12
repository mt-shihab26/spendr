import type { TPaginated } from '@/types/utils';
import type { TTransfer, TWallet } from '@/types/models';

import { router } from '@inertiajs/react';

import { InfiniteScroll } from '@inertiajs/react';
import { Repeat } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransfersTable } from '@/components/screens/transfers/transfers-table';
import { DateRangePicker } from '@/components/elements/date-range-picker';
import { WalletSelect } from '@/components/elements/wallet-select';
import { EmptyState } from '@/components/elements/empty-state';

type TFilters = {
    wallet_id: string | null;
    date_from: string | null;
    date_to: string | null;
};

const TransfersIndex = ({
    filters,
    wallets,
    transfers,
}: {
    filters: TFilters;
    wallets: TWallet[];
    transfers: TPaginated<TTransfer>;
}) => {
    const navigate = (params: Partial<TFilters>) => {
        router.get(
            route('transfers.index'),
            {
                ...filters,
                ...params,
            },
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout
            title="Transfers"
            description="Move funds between your wallets"
            breadcrumbs={[{ title: 'Transfers', route: 'transfers.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Transfers (${transfers.total})`}
                        description="Move funds between your wallets"
                    />
                    <NewButton href={route('transfers.create')}>
                        New Transfer
                    </NewButton>
                </div>
                <div className="flex items-center gap-2">
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
                    <div>
                        <DateRangePicker
                            dateFrom={filters.date_from}
                            dateTo={filters.date_to}
                            onClear={() =>
                                navigate({ date_from: null, date_to: null })
                            }
                            onSelect={(dates) =>
                                navigate({
                                    date_from: dates?.from ?? null,
                                    date_to: dates?.to ?? null,
                                })
                            }
                        />
                    </div>
                </div>
                {transfers.data.length === 0 ? (
                    <EmptyState
                        icon={<Repeat />}
                        title="No transfers yet"
                        description="Move funds between wallets to keep your balances accurate."
                        href={route('transfers.create')}
                        action="Record first transfer"
                    />
                ) : (
                    <InfiniteScroll data="transfers" onlyNext preserveUrl>
                        <TransfersTable transfers={transfers.data} />
                    </InfiniteScroll>
                )}
            </div>
        </AppLayout>
    );
};

export default TransfersIndex;
