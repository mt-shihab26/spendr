import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';

import type { TWallet } from '@/types/models';
import type { TCurrency } from '@/types/enums';

import { useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { Label } from '@/components/ui/label';

import { CURRENCIES_OPTIONS } from '@/lib/options';

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

export const WalletForm = ({ wallet }: { wallet?: TWallet }) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: wallet?.name ?? '',
        currency: wallet?.currency ?? 'BDT',
        initial_balance: wallet?.initial_balance ?? '0.00',
        color: wallet?.color ?? '#6366f1',
        icon: wallet?.icon ?? '',
        is_default: wallet?.is_default ?? false,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (wallet) {
                    patch(route('wallets.store'));
                } else {
                    post(route('wallets.update'));
                }
            }}
            className="space-y-5"
        >
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
                    className="w-full"
                    onChange={(e) =>
                        setData('currency', e.target.value as TCurrency)
                    }
                >
                    {CURRENCIES_OPTIONS.map((c) => (
                        <NativeSelectOption key={c} value={c}>
                            {c}
                        </NativeSelectOption>
                    ))}
                </NativeSelect>
                <InputError message={errors.currency} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="initial_balance">Initial Balance</Label>
                <NumberInput
                    id="initial_balance"
                    name="initial_balance"
                    placeholder="0.00"
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator
                    allowNegative={false}
                    value={data.initial_balance}
                    onValueChange={({ value }) =>
                        setData('initial_balance', value)
                    }
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
                                    ? 'scale-110 border-foreground'
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
                    className="cursor-pointer font-normal"
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
                    {!wallet ? 'Create Wallet' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
