import type { ReactNode } from 'react';

import { AppContent } from '@/components/elements/app-content';
import { AppHeader } from '@/components/elements/app-header';
import { AppShell } from '@/components/elements/app-shell';
import type { TBreadcrumb } from '@/types/utils';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: {
    children: ReactNode;
    breadcrumbs?: TBreadcrumb[];
}) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
