import { Input } from '@/components/ui/input';
import { localToUtcDatetime, utcToLocalDatetimeInput } from '@/lib/date';

export const DateTimeInput = ({
    id,
    value,
    onChange,
    disabled = false,
    required = false,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
}) => {
    return (
        <Input
            id={id}
            type="datetime-local"
            value={utcToLocalDatetimeInput(value)}
            onChange={(e) => onChange(localToUtcDatetime(e.target.value))}
            disabled={disabled}
            required={required}
        />
    );
};
