import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import { NewButton } from '@/components/elements/new-button';

export const EmptyState = ({
    icon,
    title,
    description,
    href,
    action,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
    action: string;
}) => {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia>{icon}</EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <NewButton href={href}>{action}</NewButton>
        </Empty>
    );
};
