import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TPaginated } from '@/types/utils';
import type { TTransfer } from '@/types/models';

import { InfiniteScroll } from '@inertiajs/react';
import { Repeat } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { TransfersTable } from '@/components/screens/transfers/transfers-table';

const TransfersIndex = ({
    transfers,
}: {
    transfers: TPaginated<TTransfer>;
}) => {
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
