import type { TWallet } from '@/types/models';

import { router } from '@inertiajs/react';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

type TPeriod = '3m' | '6m' | '12m';

const PERIOD_LABELS: Record<TPeriod, string> = {
    '3m': 'Last 3 months',
    '6m': 'Last 6 months',
    '12m': 'Last 12 months',
};

export const ReportsFilter = ({
    period,
    walletId,
    wallets,
}: {
    period: TPeriod;
    walletId: string | null;
    wallets: TWallet[];
}) => {
    const update = (params: Record<string, string | null>) => {
        router.get(
            route('reports.index'),
            Object.fromEntries(
                Object.entries({ period, wallet_id: walletId, ...params }).filter(
                    ([, v]) => v !== null,
                ),
            ),
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <NativeSelect
                value={period}
                onChange={(e) => update({ period: e.target.value })}
            >
                {(Object.keys(PERIOD_LABELS) as TPeriod[]).map((p) => (
                    <NativeSelectOption key={p} value={p}>
                        {PERIOD_LABELS[p]}
                    </NativeSelectOption>
                ))}
            </NativeSelect>

            <NativeSelect
                value={walletId ?? ''}
                onChange={(e) =>
                    update({ wallet_id: e.target.value || null })
                }
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
