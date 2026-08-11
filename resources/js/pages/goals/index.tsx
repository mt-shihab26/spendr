import type { TGoal } from '@/types/models';

import { Target } from 'lucide-react';
import { formatCurrency } from '@/lib/formats';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { Link } from '@inertiajs/react';
import { EditButton } from '@/components/elements/edit-button';
import { EmptyState } from '@/components/elements/empty-state';

const GoalCard = ({ goal }: { goal: TGoal }) => {
    const percentage = goal.progress_percentage ?? 0;
    const remaining = goal.target_amount - goal.current_amount;

    return (
        <div className="flex flex-col gap-3 border p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                            backgroundColor: goal.color + '20',
                            color: goal.color,
                        }}
                    >
                        <Target className="h-4 w-4" />
                    </div>
                    <div>
                        <Link
                            href={route('goals.show', goal.id)}
                            className="font-medium hover:underline"
                        >
                            {goal.name}
                        </Link>
                        {goal.target_date && (
                            <p className="text-xs text-muted-foreground">
                                Due {goal.target_date}
                            </p>
                        )}
                    </div>
                </div>
                <EditButton href={route('goals.edit', goal.id)} />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        {formatCurrency(goal.current_amount, goal.currency)}{' '}
                        saved
                    </span>
                    <span className="font-medium">
                        {percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${Math.min(100, percentage)}%`,
                            backgroundColor: goal.color,
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                        {remaining > 0
                            ? `${formatCurrency(remaining, goal.currency)} remaining`
                            : 'Goal reached!'}
                    </span>
                    <span>
                        Target:{' '}
                        {formatCurrency(goal.target_amount, goal.currency)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const GoalsIndex = ({ goals }: { goals: TGoal[] }) => {
    return (
        <AppLayout
            title="Goals"
            description="Track your savings targets"
            breadcrumbs={[{ title: 'Goals', route: 'goals.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Goals (${goals.length})`}
                        description="Track your savings targets"
                    />
                    <NewButton href={route('goals.create')}>New Goal</NewButton>
                </div>

                {goals.length === 0 ? (
                    <EmptyState
                        icon={<Target />}
                        title="No goals yet"
                        description="Create a savings goal to track your progress toward a financial target."
                        href={route('goals.create')}
                        action="Create your first goal"
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {goals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default GoalsIndex;
