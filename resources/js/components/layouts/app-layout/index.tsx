import type { TBreadcrumb } from '@/types/utils';
import type { ReactNode } from 'react';

import { AppHeader } from './app-header';
import { Head } from '@inertiajs/react';

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
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <AppHeader breadcrumbs={breadcrumbs} />
            <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                {children}
            </main>
        </div>
    );
};
