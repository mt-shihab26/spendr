import {
    localToUtcDatetime,
    utcToLocalDatetimeInput,
    nowUtcIso,
    normalizeUtcIso,
} from '@/lib/date';

import type { TTransfer, TWallet } from '@/types/models';

import { getCurrencySymbol } from '@/lib/currency';
import { useForm } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { WalletSelect } from '@/components/elements/wallet-select';
import { Textarea } from '@/components/ui/textarea';

export const TransferForm = ({
    transfer,
    wallets,
}: {
    transfer?: TTransfer;
    wallets: TWallet[];
}) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        from_wallet_id:
            transfer?.from_wallet_id ??
            wallets.find((w) => w.is_default)?.id ??
            null,
        to_wallet_id: transfer?.to_wallet_id ?? null,
        amount: transfer?.amount ?? 0,
        transacted_at: transfer?.transacted_at
            ? normalizeUtcIso(transfer.transacted_at)
            : nowUtcIso(),
        notes: transfer?.notes ?? '',
    });

    const fromWallet = wallets.find((w) => w.id === data.from_wallet_id);
    const availableToWallets = wallets.filter(
        (w) => w.id !== data.from_wallet_id,
    );
    const currencyPrefix = fromWallet
        ? getCurrencySymbol(fromWallet.currency)
        : '';

    return (
        <form
            className="space-y-5"
            onSubmit={(e) => {
                e.preventDefault();
                if (transfer) {
                    patch(route('transfers.update', transfer));
                } else {
                    post(route('transfers.store'));
                }
            }}
        >
            <div className="space-y-2">
                <Label>
                    From Wallet <span className="text-destructive">*</span>
                </Label>
                <WalletSelect
                    wallets={wallets}
                    value={data.from_wallet_id}
                    onValueChange={(value) => {
                        setData((prev) => ({
                            ...prev,
                            from_wallet_id: value,
                            to_wallet_id:
                                prev.to_wallet_id === value
                                    ? null
                                    : prev.to_wallet_id,
                        }));
                    }}
                    disabled={!!transfer}
                />
                <InputError message={errors.from_wallet_id} />
            </div>

            <div className="space-y-2">
                <Label>
                    To Wallet <span className="text-destructive">*</span>
                </Label>
                <WalletSelect
                    wallets={availableToWallets}
                    value={data.to_wallet_id}
                    onValueChange={(value) => setData('to_wallet_id', value)}
                    disabled={!!transfer}
                />
                <InputError message={errors.to_wallet_id} />
            </div>

            <div className="space-y-2">
                <Label>
                    Amount <span className="text-destructive">*</span>
                </Label>
                <NumberInput
                    value={data.amount}
                    onValueChange={({ value }) =>
                        setData('amount', Number(value))
                    }
                    prefix={currencyPrefix}
                />
                <InputError message={errors.amount} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="transacted_at">
                    Date <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="transacted_at"
                    type="datetime-local"
                    value={utcToLocalDatetimeInput(data.transacted_at)}
                    onChange={(e) =>
                        setData(
                            'transacted_at',
                            localToUtcDatetime(e.target.value),
                        )
                    }
                    required
                />
                <InputError message={errors.transacted_at} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Optional notes"
                />
                <InputError message={errors.notes} />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                    variant="outline"
                    type="button"
                    nativeButton={false}
                    render={<Link href={route('transfers.index')} />}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {!transfer ? 'Create Transfer' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
