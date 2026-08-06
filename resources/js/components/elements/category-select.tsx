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

import { IconBadge } from '@/components/elements/icon-badge';

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
    const selected = filtered.find((c) => c.id === value);

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                {selected ? (
                    <div className="flex items-center gap-2">
                        <IconBadge
                            icon={selected.icon}
                            color={selected.color}
                            size="sm"
                        />
                        {selected.name}
                    </div>
                ) : (
                    <SelectValue placeholder="Select category" />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {filtered.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                                <IconBadge
                                    icon={category.icon}
                                    color={category.color}
                                    size="sm"
                                />
                                {category.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
