import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/elements/input-error';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { cn } from '@/lib/utils';
import type { TWallet } from '@/types/models';

const COLORS = [
    '#6366f1',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#a855f7',
    '#ec4899',
    '#14b8a6',
];

const CURRENCIES = ['BDT', 'USD'];

type WalletFormProps = {
    wallet?: TWallet;
    action: string;
    method: 'post' | 'patch';
};

export const WalletForm = ({ wallet, action, method }: WalletFormProps) => {
    const { data, setData, submit, processing, errors } = useForm({
        name: wallet?.name ?? '',
        currency: wallet?.currency ?? 'BDT',
        initial_balance: wallet?.initial_balance ?? '0.00',
        color: wallet?.color ?? '#6366f1',
        icon: wallet?.icon ?? '',
        is_default: wallet?.is_default ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(method, action);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Cash, Bank Account"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="currency">
                    Currency <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                    id="currency"
                    name="currency"
                    value={data.currency}
                    onChange={(e) => setData('currency', e.target.value)}
                    className="w-full"
                >
                    {CURRENCIES.map((c) => (
                        <NativeSelectOption key={c} value={c}>
                            {c}
                        </NativeSelectOption>
                    ))}
                </NativeSelect>
                <InputError message={errors.currency} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="initial_balance">Initial Balance</Label>
                <Input
                    id="initial_balance"
                    name="initial_balance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.initial_balance}
                    onChange={(e) => setData('initial_balance', e.target.value)}
                    placeholder="0.00"
                />
                <InputError message={errors.initial_balance} />
            </div>

            <div className="grid gap-2">
                <Label>
                    Color <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setData('color', color)}
                            className={cn(
                                'size-6 rounded-full border-2 transition-transform hover:scale-110',
                                data.color === color
                                    ? 'border-foreground scale-110'
                                    : 'border-transparent',
                            )}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <InputError message={errors.color} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                    id="icon"
                    name="icon"
                    value={data.icon ?? ''}
                    onChange={(e) => setData('icon', e.target.value)}
                    placeholder="e.g. wallet, bank, credit-card"
                />
                <InputError message={errors.icon} />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="is_default"
                    checked={data.is_default}
                    onCheckedChange={(checked) =>
                        setData('is_default', checked === true)
                    }
                />
                <Label
                    htmlFor="is_default"
                    className="font-normal cursor-pointer"
                >
                    Set as default wallet
                </Label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                    variant="outline"
                    type="button"
                    render={<Link href={route('wallets.index')} />}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {method === 'post' ? 'Create Wallet' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
