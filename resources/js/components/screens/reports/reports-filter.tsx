import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { DateRangePicker } from '@/components/screens/reports/date-range-picker';

export const ReportsFilter = ({
    currency,
    walletId,
    wallets,
    range,
    dateFrom,
    dateTo,
}: {
    currency: string | null;
    walletId: string | null;
    wallets: TWallet[];
    range: string | null;
    dateFrom: string | null;
    dateTo: string | null;
}) => {
    const navigate = (params: Record<string, string | null>) => {
        router.get(
            route('reports.index'),
            Object.fromEntries(
                Object.entries({
                    currency,
                    wallet_id: walletId,
                    range,
                    date_from: dateFrom,
                    date_to: dateTo,
                    ...params,
                }).filter(([, v]) => v !== null && v !== undefined),
            ),
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex flex-wrap items-start gap-2">
            <DateRangePicker
                range={range}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onSelect={(newRange, dates) =>
                    navigate({
                        range: newRange,
                        date_from: dates?.from ?? null,
                        date_to: dates?.to ?? null,
                    })
                }
                onClear={() => navigate({ range: null, date_from: null, date_to: null })}
            />

            <NativeSelect
                value={walletId ?? ''}
                onChange={(e) => navigate({ wallet_id: e.target.value || null })}
            >
                <NativeSelectOption value="">All Wallets</NativeSelectOption>
                {wallets.map((w) => (
                    <NativeSelectOption key={w.id} value={w.id}>
                        {w.name}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
        </div>
    );
};
