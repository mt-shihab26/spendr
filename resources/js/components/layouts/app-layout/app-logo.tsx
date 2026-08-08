import { usePage } from '@inertiajs/react';

export const AppLogo = () => {
    const { name } = usePage().props;

    return (
        <div className="font-mono text-[23px] font-bold tracking-[-0.3px] text-foreground">
            {name}
            <span className="text-primary">.</span>
        </div>
    );
};
