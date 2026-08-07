import type { LucideIcon } from 'lucide-react';

export const Heading = ({
    title,
    description,
    icon: Icon,
    color,
    variant = 'default',
}: {
    title: string;
    description?: string;
    icon?: LucideIcon | null;
    color?: string;
    variant?: 'default' | 'small';
}) => {
    return (
        <div className="flex items-center gap-3">
            {color && (
                <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: color }}
                >
                    {Icon && <Icon className="size-5 text-white" />}
                </span>
            )}
            <header className={variant === 'small' ? '' : 'space-y-0.5'}>
                <h2
                    className={
                        variant === 'small'
                            ? 'mb-0.5 text-base font-medium'
                            : 'text-xl font-semibold tracking-tight'
                    }
                >
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </header>
        </div>
    );
};
