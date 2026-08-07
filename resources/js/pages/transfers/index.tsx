import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

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

type TFilters = {
    date_from: string | null;
    date_to: string | null;
    wallet_id: string | null;
};

const TransfersIndex = ({
    transfers,
    wallets,
    filters,
}: {
    transfers: TPaginated<TTransfer>;
    wallets: TWallet[];
    filters: TFilters;
}) => {
    const navigate = (params: Partial<TFilters>) => {
        router.get(
            route('transfers.index'),
            { ...filters, ...params },
            { preserveScroll: true, replace: true },
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
                <div className="flex flex-wrap items-center gap-2">
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
                    <div className="w-48">
                        <WalletSelect
                            wallets={wallets}
                            value={filters.wallet_id}
                            onValueChange={(value) =>
                                navigate({ wallet_id: value || null })
                            }
                            includeAll
                        />
                    </div>
                </div>
                {transfers.data.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <Repeat />
                            </EmptyMedia>
                            <EmptyTitle>No transfers yet</EmptyTitle>
                            <EmptyDescription>
                                Move funds between wallets to keep your balances
                                accurate.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('transfers.create')}>
                            Record first transfer
                        </NewButton>
                    </Empty>
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
