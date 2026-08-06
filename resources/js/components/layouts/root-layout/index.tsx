import type { ReactNode } from 'react';

import { useFlashToast } from '@/hooks/use-flash-toast';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Head } from '@inertiajs/react';

export const RootLayout = ({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) => {
    useFlashToast();

    return (
        <TooltipProvider delayDuration={0}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            {children}
            <Toaster />
        </TooltipProvider>
    );
};
