import type { TWallet } from '@/types/models';

import { useForm } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { ColorPicker } from '@/components/elements/color-picker';
import { IconPicker } from '@/components/elements/icon-picker';
import { CurrencyPicker } from '@/components/elements/currency-picker';
import { Label } from '@/components/ui/label';

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
                    patch(route('wallets.update', wallet));
                } else {
                    post(route('wallets.store'));
                }
            }}
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="wallet-name"
                    name="wallet-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Cash, Bank Account"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label>
                    Currency <span className="text-destructive">*</span>
                </Label>
                <CurrencyPicker
                    value={data.currency}
                    onChange={(currency) => setData('currency', currency)}
                />
                <InputError message={errors.currency} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="initial_balance">Initial Balance</Label>
                <NumberInput
                    id="initial_balance"
                    name="initial_balance"
                    value={data.initial_balance}
                    onValueChange={({ value }) =>
                        setData('initial_balance', value)
                    }
                />
                <InputError message={errors.initial_balance} />
            </div>

            <div className="space-y-2">
                <Label>
                    Color <span className="text-destructive">*</span>
                </Label>
                <ColorPicker
                    value={data.color}
                    onChange={(color) => setData('color', color)}
                />
                <InputError message={errors.color} />
            </div>

            <div className="space-y-2">
                <Label>Icon</Label>
                <IconPicker
                    value={data.icon}
                    onChange={(icon) => setData('icon', icon)}
                />
                <InputError message={errors.icon} />
            </div>

            <div className="flex items-center space-x-2">
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

            <div className="flex items-center justify-end space-x-2 pt-2">
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
