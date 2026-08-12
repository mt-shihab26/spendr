import { Input } from '@/components/ui/input';

export const DateInput = ({
    id,
    value,
    onChange,
    disabled = false,
}: {
    id?: string;
    value: string | null;
    onChange: (value: string) => void;
    disabled?: boolean;
}) => {
    return (
        <Input
            id={id}
            type="date"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        />
    );
};
