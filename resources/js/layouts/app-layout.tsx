import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import type { TBreadcrumb } from '@/types/utils';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: TBreadcrumb[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
