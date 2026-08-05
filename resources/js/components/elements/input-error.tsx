import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const InputError = ({
    message,
    className,
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) => {
    return message ? (
        <p
            className={cn('text-sm text-red-600 dark:text-red-400', className)}
            {...props}
        >
            {message}
        </p>
    ) : null;
};
