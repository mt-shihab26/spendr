import type { TBreadcrumb } from '@/types/utils';
import type { ReactNode } from 'react';

import { AppHeader } from './app-header';

const AppLayout = ({
    children,
    breadcrumbs = [],
}: {
    children: ReactNode;
    breadcrumbs?: TBreadcrumb[];
}) => {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader breadcrumbs={breadcrumbs} />
            <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
