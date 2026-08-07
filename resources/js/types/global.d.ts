import type { TAuth } from '@/types/auth';
import type { route as routeFn } from 'ziggy-js';

export type TInAppNotification = {
    id: string;
    data: {
        threshold: number;
        percentage: number;
        category: string;
        currency: string;
        spent: number;
        budget: number;
        budget_id: string;
        month: string;
    };
    created_at: string;
};

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
        };
    }
}
