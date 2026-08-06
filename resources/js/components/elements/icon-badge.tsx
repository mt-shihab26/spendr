import { getIcon } from '@/lib/icons';

export const IconBadge = ({
    icon,
    color,
}: {
    icon: string | null;
    color: string;
}) => {
    const Icon = getIcon(icon);

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
