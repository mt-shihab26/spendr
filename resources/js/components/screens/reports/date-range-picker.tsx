import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

type TDateRange = { from: string; to: string } | null;

const toDate = (s: string | null | undefined): Date | undefined =>
    s ? new Date(s) : undefined;

const toStr = (d: Date): string => format(d, 'yyyy-MM-dd');

export const DateRangePicker = ({
    dateFrom,
    dateTo,
    onSelect,
    onClear,
}: {
    dateFrom: string | null;
    dateTo: string | null;
    onSelect: (range: TDateRange) => void;
    onClear: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const selected: DateRange | undefined =
        dateFrom || dateTo
            ? { from: toDate(dateFrom), to: toDate(dateTo) }
            : undefined;

    const label =
        dateFrom && dateTo
            ? `${format(new Date(dateFrom), 'dd MMM yy')} – ${format(new Date(dateTo), 'dd MMM yy')}`
            : dateFrom
              ? `From ${format(new Date(dateFrom), 'dd MMM yy')}`
              : 'Custom range';

    const hasRange = !!dateFrom || !!dateTo;

    return (
        <div className="flex items-center gap-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant={hasRange ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                        >
                            <CalendarIcon className="size-3.5" />
                            {hasRange ? label : 'Custom range'}
                        </Button>
                    }
                />
                <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                        mode="range"
                        selected={selected}
                        onSelect={(range) => {
                            if (range?.from && range?.to) {
                                onSelect({ from: toStr(range.from), to: toStr(range.to) });
                                setOpen(false);
                            } else if (range?.from) {
                                onSelect({ from: toStr(range.from), to: toStr(range.from) });
                            }
                        }}
                        disabled={{ after: new Date() }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            {hasRange && (
                <Button variant="ghost" size="icon" className="size-8" onClick={onClear}>
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    );
};
