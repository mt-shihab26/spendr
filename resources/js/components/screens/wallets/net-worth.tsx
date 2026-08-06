import type { TWallet } from '@/types/models';
import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

export const NetWorth = ({ wallets }: { wallets: TWallet[] }) => {
    const netWorthByCurrency = wallets.reduce<
        Partial<Record<TCurrency, number>>
    >(
        (acc, w) => ({
            ...acc,
            [w.currency]:
                (acc[w.currency] ?? 0) + w.initial_balance,
        }),
        {},
    );

    return (
        <p className="text-xs text-muted-foreground">
            Net Worth:{' '}
            {Object.entries(netWorthByCurrency).map(
                ([currency, total], index) => (
                    <span key={currency}>
                        {index > 0 && <span className="mx-1">+</span>}
                        <span className="font-medium text-foreground">
                            {formatCurrency(total, currency as TCurrency)}
                        </span>
                    </span>
                ),
            )}
        </p>
    );
};
