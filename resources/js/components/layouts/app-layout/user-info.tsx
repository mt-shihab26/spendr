import type { TUser } from '@/types/models';

import { formatInitial } from '@/lib/formats';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const UserInfo = ({
    user,
    showEmail = false,
}: {
    user: TUser;
    showEmail?: boolean;
}) => {
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {formatInitial(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
};
