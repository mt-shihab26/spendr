import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type { TUser } from '@/types/models';

import { router } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { UserInfo } from '@/components/layouts/app-layout/user-info';

import { useCallback } from 'react';

type TCleanupFn = () => void;

const useMobileNavigation2 = (): TCleanupFn => {
    return useCallback(() => {
        // Remove pointer-events style from body...
        document.body.style.removeProperty('pointer-events');
    }, []);
};

export const UserMenuContent = ({ user }: { user: TUser }) => {
    const cleanup = useMobileNavigation2();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem
                    render={
                        <Link
                            className="block w-full cursor-pointer"
                            href={route('settings.profile.edit')}
                            prefetch
                            onClick={cleanup}
                        />
                    }
                >
                    <Settings className="mr-2" />
                    Settings
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                render={
                    <Link
                        className="block w-full cursor-pointer"
                        href={route('logout')}
                        method="post"
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    />
                }
            >
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
};
