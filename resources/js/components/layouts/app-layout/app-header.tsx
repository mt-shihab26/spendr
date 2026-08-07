import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import type { TBreadcrumb } from '@/types/utils';
import type { TInAppNotification } from '@/types/global';

import { router, usePage } from '@inertiajs/react';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { formatInitial } from '@/lib/formats';
import { mainLinks, rightLinks } from '@/lib/links';

import { Link } from '@inertiajs/react';
import { Menu, Search, Bell } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AppLogoIcon } from '@/components/icons/app-logo-icon';

import { Breadcrumbs } from './breadcrumbs';
import { UserMenuContent } from './user-menu-content';
import { AppLogo } from './app-logo';

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

const NotificationBell = ({
    notifications,
}: {
    notifications: TInAppNotification[];
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="group relative h-9 w-9 cursor-pointer"
                onClick={() => setOpen((v) => !v)}
            >
                <Bell className="size-5! opacity-80 group-hover:opacity-100" />
                {notifications.length > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </Button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-1 w-80 rounded border bg-popover shadow-md">
                        <div className="flex items-center justify-between border-b px-3 py-2">
                            <span className="text-sm font-medium">
                                Notifications
                            </span>
                            {notifications.length > 0 && (
                                <button
                                    className="text-xs text-muted-foreground hover:underline"
                                    onClick={() => {
                                        router.patch(
                                            route('notifications.read-all'),
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        {notifications.length === 0 ? (
                            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                                No new notifications
                            </p>
                        ) : (
                            <ul className="max-h-80 overflow-y-auto">
                                {notifications.map((n) => (
                                    <li
                                        key={n.id}
                                        className="border-b last:border-0"
                                    >
                                        <div className="flex items-start justify-between gap-2 px-3 py-2.5">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium">
                                                    {n.data.threshold >= 100
                                                        ? `Budget exceeded: ${n.data.category}`
                                                        : `Budget at ${n.data.threshold}%: ${n.data.category}`}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {n.data.currency}{' '}
                                                    {n.data.spent.toFixed(2)} /{' '}
                                                    {n.data.budget.toFixed(2)} •{' '}
                                                    {n.data.month}
                                                </p>
                                                <Link
                                                    href={route(
                                                        'budgets.show',
                                                        n.data.budget_id,
                                                    )}
                                                    className="mt-1 text-xs text-primary hover:underline"
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    View budget →
                                                </Link>
                                            </div>
                                            <button
                                                className="shrink-0 text-xs text-muted-foreground hover:underline"
                                                onClick={() => {
                                                    router.patch(
                                                        route(
                                                            'notifications.read',
                                                            n.id,
                                                        ),
                                                    );
                                                }}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const AppHeader = ({
    breadcrumbs = [],
}: {
    breadcrumbs?: TBreadcrumb[];
}) => {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { user } = usePage().props.auth;
    const notifications = (usePage().props.notifications ?? []) as TInAppNotification[];
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2 h-8.5 w-8.5"
                                    />
                                }
                            >
                                <Menu className="h-5 w-5" />
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainLinks().map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            {rightLinks().map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={toUrl(item.href)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={route('dashboard')}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainLinks().map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                isCurrentOrParentUrl(
                                                    item.href,
                                                ) && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isCurrentOrParentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            {searchOpen ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        router.get(route('search'), { q: searchQuery });
                                        setSearchOpen(false);
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                                        onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                                        placeholder="Search…"
                                        className="h-8 w-40 border border-input bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </form>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group h-9 w-9 cursor-pointer"
                                    onClick={() => setSearchOpen(true)}
                                >
                                    <Search className="size-5! opacity-80 group-hover:opacity-100" />
                                </Button>
                            )}
                            <div className="ml-1 hidden gap-1 lg:flex">
                                {rightLinks().map((item) => (
                                    <Tooltip key={item.title}>
                                        <TooltipTrigger>
                                            <a
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">
                                                    {item.title}
                                                </span>
                                                {item.icon && (
                                                    <item.icon className="size-5 opacity-80 group-hover:opacity-100" />
                                                )}
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                        <NotificationBell notifications={notifications} />
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1"
                                    />
                                }
                            >
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={user?.avatar}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {formatInitial(user?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {user && <UserMenuContent user={user} />}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
};
