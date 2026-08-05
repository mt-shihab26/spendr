import type { TNavItem } from '@/types/utils';
import type { ReactNode } from 'react';

import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';

import { Link } from '@inertiajs/react';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppLayout } from '@/components/layouts/app-layout';

export const SettingsLayout = ({ children }: { children: ReactNode }) => {
    const sidebarNavItems: TNavItem[] = [
        {
            title: 'Profile',
            href: route('profile.edit'),
            icon: null,
        },
        {
            title: 'Security',
            href: route('security.edit'),
            icon: null,
        },
        {
            title: 'Appearance',
            href: route('appearance.edit'),
            icon: null,
        },
    ];

    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AppLayout>
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
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': isCurrentOrParentUrl(
                                            item.href,
                                        ),
                                    })}
                                >
                                    <Link href={item.href}>
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
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
