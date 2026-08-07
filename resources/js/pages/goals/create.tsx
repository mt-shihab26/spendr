import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { GoalForm } from '@/components/screens/goals/goal-form';

const GoalsCreate = () => {
    return (
        <AppLayout
            title="New Goal"
            description="Create a savings target"
            breadcrumbs={[
                { title: 'Goals', route: 'goals.index' },
                { title: 'New Goal', route: 'goals.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Goal"
                        description="Set a savings target to work toward"
                    />
                    <BackButton href={route('goals.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <GoalForm />
                </div>
            </div>
        </AppLayout>
    );
};

export default GoalsCreate;
