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
    disabled = false,
    includeAll,
    placeholder,
    triggerClassName = 'w-full',
}: {
    categories: TCategory[];
    type?: TType;
    value: string | null;
    onValueChange: (value: string | null) => void;
    disabled?: boolean;
    includeAll?: boolean;
    placeholder?: string;
    triggerClassName?: string;
}) => {
    const filtered = type
        ? categories.filter((c) => c.type === type)
        : categories;
    const selected = filtered.find((c) => c.id === value);

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={triggerClassName}>
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
                    <SelectValue
                        placeholder={
                            placeholder ??
                            (includeAll ? 'All Categories' : 'Select category')
                        }
                    />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {includeAll && (
                        <SelectItem value="">All Categories</SelectItem>
                    )}
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
