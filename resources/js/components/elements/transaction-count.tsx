import { Hash } from 'lucide-react';

export const TransactionCount = ({
    count,
    prominent = true,
}: {
    count: number;
    prominent?: boolean;
}) => {
    if (!prominent) {
        return (
            <div className="flex items-center gap-1.5 text-xs">
                <Hash className="size-3 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">Transactions</p>
                    <p className="font-medium tabular-nums">{count}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-28">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash className="size-3" />
                Transactions
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">{count}</p>
        </div>
    );
};
