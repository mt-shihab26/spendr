import { format, parseISO } from 'date-fns';

export const localToUtcDatetime = (localDatetime: string): string => {
    return parseISO(localDatetime).toISOString();
};

export const utcToLocalDatetimeInput = (utcDatetime: string): string => {
    return format(parseISO(utcDatetime), "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatLocalDateTime = (
    date: string | null | undefined,
    pattern = 'MMM d, yyyy h:mm a',
): string => {
    return date ? format(parseISO(date), pattern) : '';
};

export const nowUtcIso = (): string => {
    return new Date().toISOString();
};
