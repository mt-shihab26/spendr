import {
    format,
    subDays,
    startOfWeek,
    startOfMonth,
    subMonths,
} from 'date-fns';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import type { DateRange } from 'react-day-picker';

import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { CalendarIcon, ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

type TDateRange = { from: string; to: string } | null;

type TPresetKey =
    | 'today'
    | 'yesterday'
    | 'last_2_days'
    | 'this_week'
    | 'this_month'
    | 'last_2_months'
    | 'last_3_months'
    | 'last_7_days'
    | 'last_14_days'
    | 'last_30_days'
    | 'last_60_days'
    | 'last_90_days'
    | 'all_time';

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');
const displayDate = (d: string) => format(new Date(d), 'MMM d, yyyy');

const PRESETS: { key: TPresetKey; label: string }[][] = [
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

const resolvePreset = (key: TPresetKey, weekStartsOn: 0 | 1 = 1): TDateRange => {
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
            return {
                from: fmt(startOfWeek(today, { weekStartsOn })),
                to: fmt(today),
            };
        case 'this_month':
            return { from: fmt(startOfMonth(today)), to: fmt(today) };
        case 'last_2_months':
            return {
                from: fmt(startOfMonth(subMonths(today, 1))),
                to: fmt(today),
            };
        case 'last_3_months':
            return {
                from: fmt(startOfMonth(subMonths(today, 2))),
                to: fmt(today),
            };
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

export const DateRangePicker = ({
    dateFrom,
    dateTo,
    onSelect,
    onClear,
}: {
    dateFrom: string | null;
    dateTo: string | null;
    onSelect: (dates: TDateRange) => void;
    onClear: () => void;
}) => {
    const { preferences } = usePage().props;
    const WEEK_START_MAP: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
        thursday: 4, friday: 5, saturday: 6,
    };
    const weekStartsOn = WEEK_START_MAP[preferences.first_day_of_week] ?? 1;

    const [open, setOpen] = useState(false);
    const [activePreset, setActivePreset] = useState<TPresetKey | null>(null);
    const [pending, setPending] = useState<DateRange | undefined>();

    const hasSelection = !!dateFrom && !!dateTo;

    const matchedPreset = useMemo(() => {
        if (!dateFrom || !dateTo) return null;
        return (
            PRESETS.flat().find(({ key }) => {
                const r = resolvePreset(key, weekStartsOn);
                return r !== null && r.from === dateFrom && r.to === dateTo;
            })?.key ?? null
        );
    }, [dateFrom, dateTo, weekStartsOn]);

    const effectivePreset = activePreset ?? matchedPreset;

    const triggerLabel =
        effectivePreset && hasSelection
            ? (PRESETS.flat().find((p) => p.key === effectivePreset)?.label ??
              'Date range')
            : hasSelection
              ? `${displayDate(dateFrom!)} – ${displayDate(dateTo!)}`
              : 'Date range';

    const calSelected: DateRange | undefined =
        pending ??
        (dateFrom && dateTo
            ? { from: new Date(dateFrom), to: new Date(dateTo) }
            : undefined);

    const dateLabel = hasSelection
        ? dateFrom === dateTo
            ? displayDate(dateFrom!)
            : `${displayDate(dateFrom!)} – ${displayDate(dateTo!)}`
        : null;

    const handlePreset = (key: TPresetKey) => {
        const dates = resolvePreset(key, weekStartsOn);
        setActivePreset(key);
        setPending(undefined);
        onSelect(dates);
        if (key !== 'all_time') setOpen(false);
        else setOpen(false);
    };

    const handleCalSelect = (r: DateRange | undefined) => {
        setPending(r);
        if (r?.from && r?.to && r.to > r.from) {
            setActivePreset(null);
            onSelect({ from: fmt(r.from), to: fmt(r.to) });
            setPending(undefined);
            setOpen(false);
        }
    };

    const handleClear = () => {
        setActivePreset(null);
        setPending(undefined);
        onClear();
    };

    return (
        <div className="flex w-full items-center gap-1">
            <Popover
                open={open}
                onOpenChange={(o) => {
                    if (!o) setPending(undefined);
                    setOpen(o);
                }}
            >
                <PopoverTrigger
                    className={cn(
                        buttonVariants({
                            variant: hasSelection ? 'default' : 'outline',
                            size: 'sm',
                        }),
                        'h-8 w-full gap-1.5 text-xs font-normal',
                    )}
                >
                    <CalendarIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{triggerLabel}</span>
                    <ChevronDownIcon className="size-3 shrink-0 opacity-60" />
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                    <div className="flex divide-x">
                        {/* Preset list */}
                        <div className="flex w-44 flex-col py-1">
                            {PRESETS.map((group, gi) => (
                                <div key={gi}>
                                    {gi > 0 && (
                                        <div className="my-1 border-t" />
                                    )}
                                    {group.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => handlePreset(key)}
                                            className={cn(
                                                'flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-muted',
                                                effectivePreset === key &&
                                                    'font-medium text-primary',
                                            )}
                                        >
                                            <span>{label}</span>
                                            {effectivePreset === key && (
                                                <CheckIcon className="size-3 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}

                            {dateLabel && (
                                <div className="mt-1 border-t px-3 pt-2 pb-1">
                                    <p className="text-xs text-muted-foreground">
                                        {dateLabel}
                                    </p>
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
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handleClear}
                >
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    );
};
