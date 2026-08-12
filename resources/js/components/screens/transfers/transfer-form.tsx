import { nowUtcIso, normalizeUtcIso } from '@/lib/date';

import type { TTransfer, TWallet } from '@/types/models';

import { useForm } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { WalletSelect } from '@/components/elements/wallet-select';
import { DateTimeInput } from '@/components/elements/datetime-input';
import { Textarea } from '@/components/ui/textarea';

export const TransferForm = ({
    transfer,
    wallets,
}: {
    transfer?: TTransfer;
    wallets: TWallet[];
}) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        from_wallet_id: transfer
            ? (transfer?.from_wallet_id ?? null)
            : (wallets.find((w) => w.is_default)?.id ?? null),
        to_wallet_id: transfer ? (transfer?.to_wallet_id ?? null) : null,
        amount: transfer ? (transfer?.amount ?? null) : 0,
        transacted_at: transfer
            ? normalizeUtcIso(transfer.transacted_at)
            : nowUtcIso(),
        notes: transfer ? (transfer?.notes ?? null) : '',
    });

    const fromWallet = wallets.find((w) => w.id === data.from_wallet_id);
    const toWallets = wallets.filter((w) => w.id !== data.from_wallet_id);

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
                    wallets={toWallets}
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
                    currency={fromWallet?.currency}
                    onValueChange={({ value }) =>
                        setData('amount', Number(value))
                    }
                />
                <InputError message={errors.amount} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="transacted_at">
                    Date <span className="text-destructive">*</span>
                </Label>
                <DateTimeInput
                    id="transacted_at"
                    value={data.transacted_at}
                    onChange={(value) => setData('transacted_at', value)}
                    required
                />
                <InputError message={errors.transacted_at} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes ?? ''}
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
