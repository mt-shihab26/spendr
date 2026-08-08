import type { TAuth } from '@/types/auth';
import type { route as routeFn } from 'ziggy-js';

export type TUserPreferences = {
    default_currency: string;
    first_day_of_week: string;
    notify_budget_alerts: boolean;
    notify_budget_alert_threshold: number;
    notify_goal_milestones: boolean;
    notify_recurring_reminders: boolean;
};

type TBudgetAlertData = {
    threshold: number;
    percentage: number;
    category: string;
    currency: string;
    spent: number;
    budget: number;
    budget_id: string;
    month: string;
};

type TGoalMilestoneData = {
    goal_id: string;
    goal_name: string;
    milestone: number;
    current_amount: number;
    target_amount: number;
    currency: string;
};

type TRecurringTransactionReminderData = {
    recurring_id: string;
    description: string;
    type: string;
    amount: number;
    frequency: string;
    next_due_at: string;
};

export type TInAppNotification =
    | { id: string; type: 'BudgetAlert'; data: TBudgetAlertData; created_at: string }
    | { id: string; type: 'GoalMilestone'; data: TGoalMilestoneData; created_at: string }
    | { id: string; type: 'RecurringTransactionReminder'; data: TRecurringTransactionReminderData; created_at: string };

declare global {
    var route: typeof routeFn;
}

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            flash: {
                success: string | null;
                error: string | null;
                info: string | null;
                warning: string | null;
            };
            auth: {
                user: TUser;
            };
            notifications: TInAppNotification[];
            preferences: TUserPreferences;
        };
    }
}
