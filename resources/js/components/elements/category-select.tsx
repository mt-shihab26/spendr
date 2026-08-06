import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TCategory } from '@/types/models';
import type { TType } from '@/types/enums';

export const CategorySelect = ({
    categories,
    type,
    value,
    onValueChange,
}: {
    categories: TCategory[];
    type: TType;
    value: string | null;
    onValueChange: (value: string | null) => void;
}) => {
    const filtered = categories.filter((c) => c.type === type);

    const items = [
        { label: 'Select category', value: null },
        ...filtered.map((c) => ({ label: c.name, value: c.id })),
    ];

    return (
        <Select items={items} value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
