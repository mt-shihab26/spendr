import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import type { TPaginated } from '@/types/utils';
import type { TTransfer, TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
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
    const navigate = (params: Partial<TFilters & { page: number }>) => {
        router.get(
            route('transfers.index'),
            { ...filters, ...params },
            { preserveScroll: true, replace: true },
        );
    };

    const pageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        if (filters.wallet_id) params.set('wallet_id', filters.wallet_id);
        params.set('page', String(page));
        return `${route('transfers.index')}?${params.toString()}`;
    };

    const renderPageLinks = () => {
        const { current_page, last_page } = transfers;
        if (last_page <= 1) return null;

        const pages: (number | 'ellipsis')[] = [];
        if (last_page <= 7) {
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            pages.push(1);
            if (current_page > 3) pages.push('ellipsis');
            for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
                pages.push(i);
            }
            if (current_page < last_page - 2) pages.push('ellipsis');
            pages.push(last_page);
        }

        return pages.map((p, i) =>
            p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                </PaginationItem>
            ) : (
                <PaginationItem key={p}>
                    <PaginationLink href={pageUrl(p)} isActive={p === current_page}>
                        {p}
                    </PaginationLink>
                </PaginationItem>
            ),
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
                        title="Transfers"
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
                                page: 1,
                            })
                        }
                        onClear={() =>
                            navigate({ date_from: null, date_to: null, page: 1 })
                        }
                    />
                    <div className="w-48">
                        <WalletSelect
                            wallets={wallets}
                            value={filters.wallet_id}
                            onValueChange={(value) =>
                                navigate({ wallet_id: value || null, page: 1 })
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
                    <>
                        <TransfersTable transfers={transfers.data} />
                        {transfers.last_page > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={pageUrl(transfers.current_page - 1)}
                                            aria-disabled={transfers.current_page === 1}
                                            className={transfers.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    {renderPageLinks()}
                                    <PaginationItem>
                                        <PaginationNext
                                            href={pageUrl(transfers.current_page + 1)}
                                            aria-disabled={transfers.current_page === transfers.last_page}
                                            className={transfers.current_page === transfers.last_page ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default TransfersIndex;
