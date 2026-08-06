import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';
import { route } from 'ziggy-js';

import { APP_NAME } from './lib/env';

createInertiaApp({
    strictMode: true,
    title: (title) => (title ? `${title} - ${APP_NAME}` : APP_NAME),
    withApp: (app, { ssr, page }) => {
        if (ssr) {
            const ziggy = (page.props as Record<string, unknown>)
                .ziggy as Parameters<typeof route>[3];
            globalThis.route = ((
                name: Parameters<typeof route>[0],
                params?: Parameters<typeof route>[1],
                absolute?: boolean,
            ) => route(name, params, absolute, ziggy)) as typeof route;
        }
        return <>{app}</>;
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
