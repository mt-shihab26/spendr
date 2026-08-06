import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlusIcon } from 'lucide-react';

export const QuickAction = () => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Button className="absolute right-10 bottom-10" size="icon-lg">
                    <PlusIcon className="size-8" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Add new Transaction</TooltipContent>
        </Tooltip>
    );
};
