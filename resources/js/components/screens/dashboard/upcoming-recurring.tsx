import type { TRecurringTransaction } from '@/types/models';

import { formatCurrency } from '@/lib/formats';

import { Link } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { ViewAllLink } from '@/components/elements/view-all-link';

export const UpcomingRecurring = ({
    upcomingRecurring,
}: {
    upcomingRecurring: TRecurringTransaction[];
}) => {
    if (upcomingRecurring.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Upcoming Recurring</p>
                <ViewAllLink href={route('recurring-transactions.index')}>
                    All Recurring
                </ViewAllLink>
            </div>
            <div className="flex-1 divide-y border">
                {upcomingRecurring.map((r) => (
                    <Link
                        key={r.id}
                        href={route('recurring-transactions.show', r.id)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                    >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                            <RefreshCw className="size-3 text-muted-foreground" />
                        </span>
                        <div className="flex flex-1 flex-col">
                            <span className="text-xs font-medium">
                                {r.description}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                                {r.frequency} · due {r.next_due_at}
                            </span>
                        </div>
                        <span className="text-xs font-semibold tabular-nums">
                            {r.wallet
                                ? formatCurrency(r.amount, r.wallet.currency)
                                : r.amount.toFixed(2)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
