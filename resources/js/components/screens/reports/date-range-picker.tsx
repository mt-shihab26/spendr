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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useState } from 'react';

import type { DateRange } from 'react-day-picker';

import { CalendarIcon, XIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

type TDateRange = { from: string; to: string } | null;

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');
const display = (d: string) => format(new Date(d), 'dd MMM yyyy');

const resolvePreset = (range: string): TDateRange => {
    const today = new Date();
    switch (range) {
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
                from: fmt(startOfWeek(today, { weekStartsOn: 1 })),
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

const PRESET_LABELS: Record<string, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    last_2_days: 'Today & Yesterday',
    this_week: 'This Week',
    this_month: 'This Month',
    last_2_months: 'Last 2 Months',
    last_3_months: 'Last 3 Months',
    last_7_days: 'Last 7 Days',
    last_14_days: 'Last 14 Days',
    last_30_days: 'Last 30 Days',
    last_60_days: 'Last 60 Days',
    last_90_days: 'Last 90 Days',
    all_time: 'All Time',
};

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
    const [calOpen, setCalOpen] = useState(false);

    const calSelected: DateRange | undefined =
        dateFrom && dateTo
            ? { from: new Date(dateFrom), to: new Date(dateTo) }
            : undefined;

    const hasCustom = !range && (dateFrom || dateTo);
    const hasRange = !!range || hasCustom;

    const calLabel =
        dateFrom && dateTo
            ? `${display(dateFrom)} – ${display(dateTo)}`
            : 'Custom range';

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Select
                    value={range ?? undefined}
                    onValueChange={(val) => {
                        const dates = resolvePreset(val);
                        onSelect(val, dates);
                    }}
                >
                    <SelectTrigger className="h-8 w-44 text-xs">
                        {!range ? (
                            <span className="text-muted-foreground">
                                Date range
                            </span>
                        ) : (
                            <SelectValue />
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last_2_days">
                            Today &amp; Yesterday
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem value="this_week">This Week</SelectItem>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="last_2_months">
                            Last 2 Months
                        </SelectItem>
                        <SelectItem value="last_3_months">
                            Last 3 Months
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                        <SelectItem value="last_14_days">
                            Last 14 Days
                        </SelectItem>
                        <SelectItem value="last_30_days">
                            Last 30 Days
                        </SelectItem>
                        <SelectItem value="last_60_days">
                            Last 60 Days
                        </SelectItem>
                        <SelectItem value="last_90_days">
                            Last 90 Days
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem value="all_time">All Time</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                    <Popover open={calOpen} onOpenChange={setCalOpen}>
                        <PopoverTrigger
                            render={
                                <Button
                                    variant={hasCustom ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-8 gap-1.5 text-xs"
                                >
                                    <CalendarIcon className="size-3.5" />
                                    {calLabel}
                                </Button>
                            }
                        />
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                mode="range"
                                defaultMonth={calSelected?.from ?? new Date()}
                                selected={calSelected}
                                onSelect={(r) => {
                                    if (r?.from && r?.to) {
                                        onSelect(null, {
                                            from: fmt(r.from),
                                            to: fmt(r.to),
                                        });
                                        setCalOpen(false);
                                    }
                                }}
                                disabled={{ after: new Date() }}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    {hasRange && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={onClear}
                        >
                            <XIcon className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {dateFrom && dateTo && (
                <p className="text-xs text-muted-foreground">
                    {range ? PRESET_LABELS[range] + ': ' : ''}
                    {display(dateFrom)} – {display(dateTo)}
                </p>
            )}
        </div>
    );
};
