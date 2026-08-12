import { WithTooltip } from '@/components/elements/with-tooltip';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export const QuickAction = () => {
    return (
        <WithTooltip content="Add Transaction" side="left" className="fixed right-8 bottom-8">
            <Button
                nativeButton={false}
                render={<Link href="/transactions/create" />}
                className="size-12 rounded-none shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
            >
                <PlusIcon className="size-8" />
            </Button>
        </WithTooltip>
    );
};
