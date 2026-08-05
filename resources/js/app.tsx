import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { APP_NAME } from './lib/env';

createInertiaApp({
    strictMode: true,
    title: (title) => (title ? `${title} - ${APP_NAME}` : APP_NAME),
    withApp: (app) => (
        <TooltipProvider delayDuration={0}>
            {app}
            <Toaster />
        </TooltipProvider>
    ),
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
