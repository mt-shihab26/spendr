import type { ReactNode } from 'react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const WithTooltip = ({
    content,
    children,
    className,
    side = 'top',
}: {
    content: ReactNode;
    children: ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger render={<span className={className} />}>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side}>{content}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
