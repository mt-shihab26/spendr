import type { InertiaLinkProps } from '@inertiajs/react';
import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

export const toUrl = (url: NonNullable<InertiaLinkProps['href']>): string => {
    return typeof url === 'string' ? url : url.url;
};
