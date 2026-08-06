import { format, parseISO } from 'date-fns';

export const localToUtcDatetime = (localDatetime: string): string => {
    return parseISO(localDatetime).toISOString();
};

export const utcToLocalDatetimeInput = (utcDatetime: string): string => {
    return format(parseISO(utcDatetime), "yyyy-MM-dd'T'HH:mm:ss");
};

export const nowUtcIso = (): string => {
    return new Date().toISOString();
};

export const normalizeUtcIso = (date: string): string => {
    return parseISO(date).toISOString();
};

const parse = (date: string | null | undefined) => {
    return date ? parseISO(date) : null;
};

export const formatLocalDate = (date: string | null | undefined): string => {
    const d = parse(date);
    return d ? format(d, 'MMM d, yyyy') : '';
};

export const formatLocalDateLong = (
    date: string | null | undefined,
): string => {
    const d = parse(date);
    return d ? format(d, 'EEEE, MMMM d, yyyy') : '';
};

export const formatLocalDateTime = (
    date: string | null | undefined,
): string => {
    const d = parse(date);
    return d ? format(d, 'MMM d, yyyy h:mm a') : '';
};

export const formatLocalDateTimeLong = (
    date: string | null | undefined,
): string => {
    const d = parse(date);
    return d ? format(d, 'EEEE, MMM d, yyyy h:mm a') : '';
};
