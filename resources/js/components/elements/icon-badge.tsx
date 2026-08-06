import { getIcon } from '@/lib/icons';

export const IconBadge = ({
    icon,
    color = '#6366f1',
}: {
    icon: string | null | undefined;
    color?: string;
}) => {
    const Icon = getIcon(icon ?? null);

    return Icon ? (
        <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
        >
            <Icon className="size-3 text-white" />
        </span>
    ) : (
        <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
        />
    );
};
