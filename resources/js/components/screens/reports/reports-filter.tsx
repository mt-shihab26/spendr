import type { TCurrency } from '@/types/enums';
import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { getCurrencySymbol } from '@/lib/currency';
import { DateRangePicker } from '@/components/screens/reports/date-range-picker';

type TPeriod = '3m' | '6m' | '12m';

const PERIOD_LABELS: Record<TPeriod, string> = {
    '3m': 'Last 3 months',
    '6m': 'Last 6 months',
    '12m': 'Last 12 months',
};

export const ReportsFilter = ({
    period,
    currency,
    walletId,
    currencies,
    wallets,
    dateFrom,
    dateTo,
}: {
    period: TPeriod;
    currency: string | null;
    walletId: string | null;
    currencies: string[];
    wallets: TWallet[];
    dateFrom: string | null;
    dateTo: string | null;
}) => {
    const navigate = (params: Record<string, string | null>) => {
        router.get(
            route('reports.index'),
            Object.fromEntries(
                Object.entries({
                    period,
                    currency,
                    wallet_id: walletId,
                    date_from: dateFrom,
                    date_to: dateTo,
                    ...params,
                }).filter(([, v]) => v !== null && v !== undefined),
            ),
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <NativeSelect
                value={period}
                onChange={(e) => navigate({ period: e.target.value, date_from: null, date_to: null })}
            >
                {(Object.keys(PERIOD_LABELS) as TPeriod[]).map((p) => (
                    <NativeSelectOption key={p} value={p}>
                        {PERIOD_LABELS[p]}
                    </NativeSelectOption>
                ))}
            </NativeSelect>

            <DateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onSelect={({ from, to }) =>
                    navigate({ date_from: from, date_to: to })
                }
                onClear={() => navigate({ date_from: null, date_to: null })}
            />

            {currencies.length > 1 && (
                <NativeSelect
                    value={currency ?? ''}
                    onChange={(e) =>
                        navigate({ currency: e.target.value || null, wallet_id: null })
                    }
                >
                    {currencies.map((c) => (
                        <NativeSelectOption key={c} value={c}>
                            {getCurrencySymbol(c as TCurrency)} {c}
                        </NativeSelectOption>
                    ))}
                </NativeSelect>
            )}

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
