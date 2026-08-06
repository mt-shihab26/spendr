import type { TBudget } from '@/types/models';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formats';
import { CURRENCIES_OPTIONS } from '@/lib/currency';

export const BudgetProgress = ({
    amount,
    spent = {},
}: {
    amount: TBudget['amount'];
    spent?: TBudget['spent'];
}) => {
    return (
        <div className="flex flex-col gap-2">
            {CURRENCIES_OPTIONS.map((currency) => {
                const limit = amount[currency] ?? 0;
                const spentAmt = spent?.[currency] ?? 0;
                const remaining = limit - spentAmt;
                const pct = limit > 0 ? (spentAmt / limit) * 100 : 0;

                return (
                    <div key={currency} className="flex items-center gap-3">
                        <span className="w-8 text-xs text-muted-foreground">
                            {currency}
                        </span>
                        <div className="flex-1">
                            <div className="mb-1 flex justify-between text-xs">
                                <span className="tabular-nums text-muted-foreground">
                                    {formatCurrency(spentAmt, currency)} spent
                                </span>
                                <span
                                    className={cn(
                                        'tabular-nums',
                                        remaining < 0
                                            ? 'text-destructive'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {remaining < 0 ? '−' : ''}
                                    {formatCurrency(Math.abs(remaining), currency)}{' '}
                                    {remaining >= 0 ? 'left' : 'over'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        pct >= 100
                                            ? 'bg-destructive'
                                            : pct >= 80
                                              ? 'bg-amber-500'
                                              : 'bg-primary',
                                    )}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                            </div>
                        </div>
                        <span className="w-16 text-right text-xs font-medium tabular-nums">
                            {formatCurrency(limit, currency)}
                            <span className="ml-0.5 font-normal text-muted-foreground">
                                /mo
                            </span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
