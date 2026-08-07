import {
    format,
    addMonths,
    subMonths,
    parseISO,
    setYear,
    getYear,
} from 'date-fns';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

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
    const currentYear = getYear(date);
    const thisYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => thisYear - 5 + i);

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

            <Popover>
                <PopoverTrigger
                    render={
                        <Button
                            variant="outline"
                            className="min-w-24 px-3 text-sm font-medium"
                        />
                    }
                >
                    {format(date, 'MMM yyyy')}
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <div className="grid grid-cols-3 gap-1">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => navigate(setYear(date, year))}
                                className={`rounded px-2 py-1 text-xs transition-colors hover:bg-accent ${
                                    year === currentYear
                                        ? 'bg-primary text-primary-foreground'
                                        : ''
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

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
