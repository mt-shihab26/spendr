import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TWallet } from '@/types/models';

export const WalletSelect = ({
    wallets,
    value,
    onValueChange,
}: {
    wallets: TWallet[];
    value: string | null;
    onValueChange: (value: string) => void;
}) => {
    const items = [
        { label: 'Select wallet', value: null },
        ...wallets.map((w) => ({ label: w.name, value: w.id })),
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
