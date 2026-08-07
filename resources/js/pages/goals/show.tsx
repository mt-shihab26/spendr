import type { TGoal } from '@/types/models';

import { useForm } from '@inertiajs/react';
import { formatCurrency } from '@/lib/formats';
import { Target } from 'lucide-react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';

const GoalsShow = ({ goal }: { goal: TGoal }) => {
    const { delete: destroy, processing } = useForm({});
    const percentage = goal.progress_percentage ?? 0;
    const remaining = goal.target_amount - goal.current_amount;

    const handleDelete = () => {
        if (!confirm(`Delete goal "${goal.name}"?`)) {
            return;
        }
        destroy(route('goals.destroy', goal.id));
    };

    return (
        <AppLayout
            title={goal.name}
            description={goal.description ?? 'Savings goal'}
            breadcrumbs={[
                { title: 'Goals', route: 'goals.index' },
                {
                    title: goal.name,
                    route: 'goals.show',
                    params: { goal: goal.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={goal.name}
                        description={goal.description ?? ''}
                    />
                    <div className="flex items-center gap-1">
                        <EditButton href={route('goals.edit', goal.id)} />
                        <BackButton href={route('goals.index')} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Saved</p>
                        <p className="mt-1 text-lg font-semibold">
                            {formatCurrency(goal.current_amount, goal.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="mt-1 text-lg font-semibold">
                            {formatCurrency(goal.target_amount, goal.currency)}
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            {remaining > 0 ? 'Remaining' : 'Over target'}
                        </p>
                        <p
                            className={`mt-1 text-lg font-semibold ${remaining <= 0 ? 'text-green-600' : ''}`}
                        >
                            {formatCurrency(Math.abs(remaining), goal.currency)}
                        </p>
                    </div>
                </div>

                <div className="border p-4">
                    <div className="mb-3 flex items-center gap-2">
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
                            <p className="font-medium">{goal.name}</p>
                            {goal.target_date && (
                                <p className="text-xs text-muted-foreground">
                                    Target date: {goal.target_date}
                                </p>
                            )}
                        </div>
                        <span className="ml-auto text-sm font-semibold">
                            {percentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${Math.min(100, percentage)}%`,
                                backgroundColor: goal.color,
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete Goal
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
};

export default GoalsShow;
