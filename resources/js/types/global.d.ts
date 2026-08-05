import type { TAuth } from '@/types/auth';
import type { route as routeFn } from 'ziggy-js';

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
            sidebarOpen: boolean;
            auth: {
                user: TUser;
            };
        };
    }
}
