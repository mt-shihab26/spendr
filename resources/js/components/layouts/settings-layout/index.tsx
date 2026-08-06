import type { ReactNode } from 'react';
import type { TBreadcrumb } from '@/types/utils';

import { cn } from '@/lib/utils';

import { Link } from '@inertiajs/react';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppLayout } from '@/components/layouts/app-layout';
import { Lock, Palette, User } from 'lucide-react';

const links = [
    {
        title: 'Profile',
        route: 'profile.edit',
        icon: User,
    },
    {
        title: 'Security',
        route: 'security.edit',
        icon: Lock,
    },
    {
        title: 'Appearance',
        route: 'appearance.edit',
        icon: Palette,
    },
];

export const SettingsLayout = ({
    children,
    title,
    description,
    breadcrumbs,
}: {
    children: ReactNode;
    title: string;
    description: string;
    breadcrumbs: TBreadcrumb[];
}) => {
    return (
        <AppLayout
            title={title}
            description={description}
            breadcrumbs={[
                { title: 'Settings', route: 'profile.edit' },
                ...breadcrumbs,
            ]}
        >
            <div className="px-4 py-6">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav
                            className="flex flex-col space-y-1 space-x-0"
                            aria-label="Settings"
                        >
                            {links.map((item, index) => (
                                <Button
                                    key={`${item.route}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': route().current(item.route),
                                    })}
                                >
                                    <Link href={route(item.route)}>
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>
                    <Separator className="my-6 lg:hidden" />
                    <div className="flex-1 md:max-w-2xl">
                        <section className="max-w-xl space-y-12">
                            <div className="space-y-6">
                                <Heading
                                    variant="small"
                                    title={title}
                                    description={description}
                                />
                                {children}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
