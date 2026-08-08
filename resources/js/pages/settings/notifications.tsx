import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InputError } from '@/components/elements/input-error';
import { SettingsLayout } from '@/components/layouts/settings-layout';

type TNotificationPreferences = {
    notify_budget_alerts: boolean;
    notify_budget_alert_threshold: number;
    notify_goal_milestones: boolean;
    notify_recurring_reminders: boolean;
};

const Notifications = ({
    preferences,
}: {
    preferences: TNotificationPreferences;
}) => {
    const { data, setData, patch, processing, errors } =
        useForm<TNotificationPreferences>(preferences);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.notifications.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout
            title="Notification settings"
            description="Control which email notifications you receive"
            breadcrumbs={[
                {
                    title: 'Notifications',
                    route: 'settings.notifications.edit',
                },
            ]}
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="notify_budget_alerts">
                                Budget alerts
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Receive an email when you approach or exceed
                                your budget
                            </p>
                        </div>
                        <Switch
                            id="notify_budget_alerts"
                            checked={data.notify_budget_alerts}
                            onCheckedChange={(v) =>
                                setData('notify_budget_alerts', v)
                            }
                        />
                    </div>

                    {data.notify_budget_alerts && (
                        <div className="grid gap-2 pl-0">
                            <Label htmlFor="notify_budget_alert_threshold">
                                Alert threshold (%)
                            </Label>
                            <Input
                                id="notify_budget_alert_threshold"
                                type="number"
                                min={1}
                                max={100}
                                className="w-32"
                                value={data.notify_budget_alert_threshold}
                                onChange={(e) =>
                                    setData(
                                        'notify_budget_alert_threshold',
                                        Number(e.target.value),
                                    )
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Get notified when spending reaches this
                                percentage of your budget
                            </p>
                            <InputError
                                message={errors.notify_budget_alert_threshold}
                            />
                        </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="notify_goal_milestones">
                                Goal milestones
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Receive an email when you reach a goal milestone
                            </p>
                        </div>
                        <Switch
                            id="notify_goal_milestones"
                            checked={data.notify_goal_milestones}
                            onCheckedChange={(v) =>
                                setData('notify_goal_milestones', v)
                            }
                        />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="notify_recurring_reminders">
                                Recurring transaction reminders
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Receive reminders for upcoming recurring
                                transactions
                            </p>
                        </div>
                        <Switch
                            id="notify_recurring_reminders"
                            checked={data.notify_recurring_reminders}
                            onCheckedChange={(v) =>
                                setData('notify_recurring_reminders', v)
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        Save
                    </Button>
                </div>
            </form>
        </SettingsLayout>
    );
};

export default Notifications;
