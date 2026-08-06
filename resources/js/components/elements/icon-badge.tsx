import { getIcon } from '@/lib/icons';

const sizes = {
    sm: { badge: 'size-4', icon: 'size-2.5' },
    md: { badge: 'size-6', icon: 'size-3' },
};

export const IconBadge = ({
    icon,
    color = '#6366f1',
    size = 'md',
}: {
    icon: string | null | undefined;
    color?: string;
    size?: 'sm' | 'md';
}) => {
    const Icon = getIcon(icon ?? null);
    const s = sizes[size];

    return Icon ? (
        <span
            className={`flex ${s.badge} shrink-0 items-center justify-center rounded-full`}
            style={{ backgroundColor: color }}
        >
            <Icon className={`${s.icon} text-white`} />
        </span>
    ) : (
        <span
            className={`${s.badge} shrink-0 rounded-full`}
            style={{ backgroundColor: color }}
        />
    );
};
