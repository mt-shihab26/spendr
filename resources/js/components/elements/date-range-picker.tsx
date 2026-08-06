import type { DateRange } from 'react-day-picker';

import { useState } from 'react';
import { format, subDays, startOfWeek, startOfMonth, subMonths } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TDateRange = { from: string; to: string } | null;

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

const displayDate = (d: string) => format(new Date(d), 'MMM d, yyyy');

const resolvePreset = (key: string): TDateRange => {
    const today = new Date();
    switch (key) {
        case 'today':
            return { from: fmt(today), to: fmt(today) };
        case 'yesterday': {
            const y = subDays(today, 1);
            return { from: fmt(y), to: fmt(y) };
        }
        case 'last_2_days':
            return { from: fmt(subDays(today, 1)), to: fmt(today) };
        case 'this_week':
            return { from: fmt(startOfWeek(today, { weekStartsOn: 1 })), to: fmt(today) };
        case 'this_month':
            return { from: fmt(startOfMonth(today)), to: fmt(today) };
        case 'last_2_months':
            return { from: fmt(startOfMonth(subMonths(today, 1))), to: fmt(today) };
        case 'last_3_months':
            return { from: fmt(startOfMonth(subMonths(today, 2))), to: fmt(today) };
        case 'last_7_days':
            return { from: fmt(subDays(today, 6)), to: fmt(today) };
        case 'last_14_days':
            return { from: fmt(subDays(today, 13)), to: fmt(today) };
        case 'last_30_days':
            return { from: fmt(subDays(today, 29)), to: fmt(today) };
        case 'last_60_days':
            return { from: fmt(subDays(today, 59)), to: fmt(today) };
        case 'last_90_days':
            return { from: fmt(subDays(today, 89)), to: fmt(today) };
        case 'all_time':
            return null;
        default:
            return null;
    }
};

const PRESETS: { key: string; label: string }[][] = [
    [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'last_2_days', label: 'Today & Yesterday' },
    ],
    [
        { key: 'this_week', label: 'This Week' },
        { key: 'this_month', label: 'This Month' },
        { key: 'last_2_months', label: 'Last 2 Months' },
        { key: 'last_3_months', label: 'Last 3 Months' },
    ],
    [
        { key: 'last_7_days', label: 'Last 7 Days' },
        { key: 'last_14_days', label: 'Last 14 Days' },
        { key: 'last_30_days', label: 'Last 30 Days' },
        { key: 'last_60_days', label: 'Last 60 Days' },
        { key: 'last_90_days', label: 'Last 90 Days' },
    ],
    [{ key: 'all_time', label: 'All Time' }],
];

const PRESET_LABEL: Record<string, string> = Object.fromEntries(
    PRESETS.flat().map(({ key, label }) => [key, label]),
);

export const DateRangePicker = ({
    range,
    dateFrom,
    dateTo,
    onSelect,
    onClear,
}: {
    range: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    onSelect: (range: string | null, dates: TDateRange) => void;
    onClear: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState<DateRange | undefined>();

    const hasSelection = !!range || (!!dateFrom && !!dateTo);

    const triggerLabel = range
        ? PRESET_LABEL[range]
        : dateFrom && dateTo
          ? `${displayDate(dateFrom)} – ${displayDate(dateTo)}`
          : 'Date range';

    // Calendar shows pending range while selecting, otherwise props-derived range
    const calSelected: DateRange | undefined =
        pending ??
        (dateFrom && dateTo
            ? { from: new Date(dateFrom), to: new Date(dateTo) }
            : undefined);

    // Resolved date string for the selected preset
    const resolvedDates = range ? resolvePreset(range) : null;
    const dateLabel =
        resolvedDates?.from && resolvedDates?.to
            ? resolvedDates.from === resolvedDates.to
                ? displayDate(resolvedDates.from)
                : `${displayDate(resolvedDates.from)} – ${displayDate(resolvedDates.to)}`
            : dateFrom && dateTo && !range
              ? `${displayDate(dateFrom)} – ${displayDate(dateTo)}`
              : null;

    const handlePreset = (key: string) => {
        const dates = resolvePreset(key);
        setPending(undefined);
        onSelect(key, dates);
        setOpen(false);
    };

    const handleCalSelect = (r: DateRange | undefined) => {
        setPending(r);
        if (r?.from && r?.to && r.to > r.from) {
            onSelect(null, { from: fmt(r.from), to: fmt(r.to) });
            setPending(undefined);
            setOpen(false);
        }
    };

    const handleOpenChange = (o: boolean) => {
        if (!o) setPending(undefined);
        setOpen(o);
    };

    const handleClear = () => {
        setPending(undefined);
        onClear();
    };

    return (
        <div className="flex items-center gap-1">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger
                    render={
                        <Button
                            variant={hasSelection ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-normal"
                        >
                            <CalendarIcon className="size-3.5 shrink-0" />
                            <span className="max-w-48 truncate">{triggerLabel}</span>
                            <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
                        </Button>
                    }
                />
                <PopoverContent align="start" className="w-auto p-0">
                    <div className="flex divide-x">
                        {/* Preset list */}
                        <div className="flex w-44 flex-col py-1">
                            {PRESETS.map((group, gi) => (
                                <div key={gi}>
                                    {gi > 0 && <div className="my-1 border-t" />}
                                    {group.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => handlePreset(key)}
                                            className={cn(
                                                'flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-muted',
                                                range === key && 'font-medium text-primary',
                                            )}
                                        >
                                            <span>{label}</span>
                                            {range === key && (
                                                <CheckIcon className="size-3 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}

                            {dateLabel && (
                                <div className="mt-1 border-t px-3 pb-1 pt-2">
                                    <p className="text-xs text-muted-foreground">{dateLabel}</p>
                                </div>
                            )}
                        </div>

                        {/* Calendar */}
                        <div className="p-2">
                            <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
                                Custom range
                            </p>
                            <Calendar
                                mode="range"
                                defaultMonth={calSelected?.from ?? new Date()}
                                selected={calSelected}
                                onSelect={handleCalSelect}
                                disabled={{ after: new Date() }}
                                numberOfMonths={2}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {hasSelection && (
                <Button variant="ghost" size="icon" className="size-8" onClick={handleClear}>
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    );
};
