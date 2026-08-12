import type { TCategory, TRecurringTransaction, TWallet } from '@/types/models';

import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InputError } from '@/components/elements/input-error';
import { Switch } from '@/components/ui/switch';
import { TypePicker } from '@/components/elements/type-picker';
import { NumberInput } from '@/components/elements/number-input';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';
import type { TFrequency } from '@/types/enums';

export const RecurringTransactionForm = ({
    recurring,
    wallets,
    categories,
}: {
    recurring?: TRecurringTransaction;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        wallet_id: recurring?.wallet_id ?? '',
        category_id: recurring?.category_id ?? '',
        type: recurring ? (recurring?.type ?? null) : 'expense',
        amount: recurring?.amount ?? 0,
        name: recurring?.name ?? '',
        notes: recurring?.notes ?? '',
        frequency: recurring ? (recurring?.frequency ?? null) : 'monthly',
        next_due_at: recurring?.next_due_at ?? '',
        is_active: recurring ? (recurring?.is_active ?? null) : true,
    });

    const selectedWallet = wallets.find((w) => w.id === data.wallet_id);

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                if (recurring) {
                    patch(route('recurring-transactions.update', recurring.id));
                } else {
                    post(route('recurring-transactions.store'));
                }
            }}
        >
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Monthly rent"
                />
                <InputError message={errors.name} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <TypePicker
                    value={data.type}
                    onChange={(v) => {
                        setData('type', v);
                        setData('category_id', '');
                    }}
                />
                <InputError message={errors.type} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="wallet_id">Wallet</Label>
                <WalletSelect
                    wallets={wallets}
                    value={data.wallet_id}
                    onValueChange={(v) => setData('wallet_id', v ?? '')}
                />
                <InputError message={errors.wallet_id} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="amount">Amount</Label>
                <NumberInput
                    id="amount"
                    value={data.amount}
                    currency={selectedWallet?.currency}
                    onValueChange={({ value }) =>
                        setData('amount', Number(value))
                    }
                />
                <InputError message={errors.amount} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="category_id">Category (optional)</Label>
                <CategorySelect
                    categories={categories}
                    type={data.type}
                    value={data.category_id}
                    onValueChange={(v) => setData('category_id', v ?? '')}
                />
                <InputError message={errors.category_id} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                        value={data.frequency}
                        onValueChange={(v) =>
                            setData('frequency', v as TFrequency)
                        }
                    >
                        <SelectTrigger id="frequency">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.frequency} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="next_due_at">Next Due Date</Label>
                    <Input
                        id="next_due_at"
                        type="date"
                        value={data.next_due_at}
                        onChange={(e) => setData('next_due_at', e.target.value)}
                    />
                    <InputError message={errors.next_due_at} />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={2}
                />
                <InputError message={errors.notes} />
            </div>

            <div className="flex items-center gap-3">
                <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(v) => setData('is_active', v)}
                />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing
                    ? 'Saving...'
                    : recurring
                      ? 'Update'
                      : 'Create Recurring Transaction'}
            </Button>
        </form>
    );
};
