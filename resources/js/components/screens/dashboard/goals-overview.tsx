import type { TGoal } from '@/types/models';

import { Link } from '@inertiajs/react';
import { Target } from 'lucide-react';
import { ViewAllLink } from '@/components/elements/view-all-link';

export const GoalsOverview = ({ goals }: { goals: TGoal[] }) => {
    if (goals.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Goals</p>
                <ViewAllLink href={route('goals.index')}>All Goals</ViewAllLink>
            </div>
            <div className="divide-y border">
                {goals.map((goal) => {
                    const pct = goal.progress_percentage ?? 0;
                    return (
                        <Link
                            key={goal.id}
                            href={route('goals.show', goal.id)}
                            className="block px-4 py-3 hover:bg-muted/50"
                        >
                            <div className="mb-1.5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className="flex size-5 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: goal.color + '20',
                                            color: goal.color,
                                        }}
                                    >
                                        <Target className="size-3" />
                                    </div>
                                    <span className="text-xs font-medium">
                                        {goal.name}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {pct.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(100, pct)}%`,
                                        backgroundColor: goal.color,
                                    }}
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
