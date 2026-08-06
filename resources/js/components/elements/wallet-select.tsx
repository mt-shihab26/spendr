import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { TWallet } from '@/types/models';

import { IconBadge } from '@/components/elements/icon-badge';

export const WalletSelect = ({
    wallets,
    value,
    onValueChange,
    disabled = false,
}: {
    wallets: TWallet[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    disabled?: boolean;
}) => {
    const selected = wallets.find((w) => w.id === value);

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
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
                    <SelectValue placeholder="Select wallet" />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                            <div className="flex items-center gap-2">
                                <IconBadge
                                    icon={wallet.icon}
                                    color={wallet.color}
                                    size="sm"
                                />
                                {wallet.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
