import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MonthPicker = ({
    month,
    href,
    extraParams = {},
}: {
    month: string;
    href: string;
    extraParams?: Record<string, string>;
}) => {
    const date = parseISO(`${month}-01`);

    const navigate = (newDate: Date) => {
        router.get(
            href,
            { ...extraParams, month: format(newDate, 'yyyy-MM') },
            { preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => navigate(subMonths(date, 1))}
            >
                <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-24 text-center text-sm font-medium">
                {format(date, 'MMM yyyy')}
            </span>
            <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => navigate(addMonths(date, 1))}
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
};
