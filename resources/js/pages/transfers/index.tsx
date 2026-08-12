import type { TPaginated } from '@/types/utils';
import type { TTransterWithRelations } from '@/types/withs';
import type { TWallet } from '@/types/models';
import type { TTransferStat } from '@/components/screens/transfers/transfer-stats';
import type { TFilters } from '@/components/screens/transfers/transters-filters';

import { router } from '@inertiajs/react';

import { InfiniteScroll } from '@inertiajs/react';
import { Repeat } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransfersTable } from '@/components/screens/transfers/transfers-table';
import { TransferStats } from '@/components/screens/transfers/transfer-stats';
import { EmptyState } from '@/components/elements/empty-state';
import { TransfersFilters } from '@/components/screens/transfers/transters-filters';

const TransfersIndex = ({
    filters,
    wallets,
    transfers,
    stats,
}: {
    filters: TFilters;
    wallets: TWallet[];
    transfers: TPaginated<TTransterWithRelations>;
    stats: TTransferStat[];
}) => {
    const title = `Transfers (${transfers.total})`;

    return (
        <AppLayout
            title={title}
            description="Move funds between your wallets"
            breadcrumbs={[{ title: 'Transfers', route: 'transfers.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={title}
                        description="Move funds between your wallets"
                    />
                    <NewButton href={route('transfers.create')}>
                        New Transfer
                    </NewButton>
                </div>
                <TransfersFilters wallets={wallets} filters={filters} />
                {transfers.data.length === 0 ? (
                    <EmptyState
                        icon={<Repeat />}
                        title="No transfers yet"
                        description="Move funds between wallets to keep your balances accurate."
                        href={route('transfers.create')}
                        action="Record first transfer"
                    />
                ) : (
                    <>
                        <TransferStats stats={stats} />
                        <InfiniteScroll data="transfers" onlyNext preserveUrl>
                            <TransfersTable transfers={transfers.data} />
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default TransfersIndex;
