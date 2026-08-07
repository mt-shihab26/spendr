import type { TGoal } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { GoalForm } from '@/components/screens/goals/goal-form';

const GoalsEdit = ({ goal }: { goal: TGoal }) => {
    return (
        <AppLayout
            title={`Edit: ${goal.name}`}
            description="Update your savings goal"
            breadcrumbs={[
                { title: 'Goals', route: 'goals.index' },
                {
                    title: goal.name,
                    route: 'goals.show',
                    params: { goal: goal.id },
                },
                {
                    title: 'Edit',
                    route: 'goals.edit',
                    params: { goal: goal.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Edit: ${goal.name}`}
                        description="Update your savings goal"
                    />
                    <BackButton href={route('goals.show', goal.id)} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <GoalForm goal={goal} />
                </div>
            </div>
        </AppLayout>
    );
};

export default GoalsEdit;
