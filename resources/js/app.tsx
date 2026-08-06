import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';

import { APP_NAME } from './lib/env';

createInertiaApp({
    strictMode: true,
    title: (title) => (title ? `${title} - ${APP_NAME}` : APP_NAME),
    withApp: (app) => <>{app}</>,
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
