import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export const QuickAction = () => {
    return (
        <Tooltip>
            <TooltipTrigger
                className="fixed right-10 bottom-10"
                render={<span />}
            >
                <Button
                    size="icon-lg"
                    nativeButton={false}
                    render={<Link href="/transactions/create" />}
                >
                    <PlusIcon className="size-8" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add new Transaction</TooltipContent>
        </Tooltip>
    );
};
