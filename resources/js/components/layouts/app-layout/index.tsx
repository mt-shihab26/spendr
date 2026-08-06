import type { TBreadcrumb } from '@/types/utils';
import type { ReactNode } from 'react';

import { AppHeader } from './app-header';
import { RootLayout } from '@/components/layouts/root-layout';
import { QuickAction } from './quick-action';

export const AppLayout = ({
    title,
    description,
    children,
    breadcrumbs,
}: {
    title: string;
    description: string;
    children: ReactNode;
    breadcrumbs?: TBreadcrumb[];
}) => {
    return (
        <RootLayout title={title} description={description}>
            <div className="flex min-h-screen w-full flex-col">
                <AppHeader breadcrumbs={breadcrumbs} />
                <main className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                    {children}
                    <QuickAction />
                </main>
            </div>
        </RootLayout>
    );
};
