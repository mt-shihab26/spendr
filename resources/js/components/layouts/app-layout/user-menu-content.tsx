import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type { TUser } from '@/types/models';

import { useHttp } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { Home, LogOut, Settings } from 'lucide-react';
import { UserInfo } from '@/components/layouts/app-layout/user-info';

import { useCallback } from 'react';

const useMobileNavigation = () => {
    return useCallback(() => {
        // Remove pointer-events style from body...
        document.body.style.removeProperty('pointer-events');
    }, []);
};

export const UserMenuContent = ({ user }: { user: TUser }) => {
    const cleanup = useMobileNavigation();

    const { post } = useHttp();

    const handleLogout = () => {
        cleanup();
        post(route('logout'), {
            onSuccess: () => {
                window.location.href = route('home');
            },
        });
    };

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <UserInfo user={user} showEmail={true} />
                    </div>
                </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem
                    render={
                        <a
                            className="block w-full cursor-pointer"
                            href={route('home')}
                        />
                    }
                >
                    <Home className="mr-2" />
                    Home
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-test="logout-button" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
};
