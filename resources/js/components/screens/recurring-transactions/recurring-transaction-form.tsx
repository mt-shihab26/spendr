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
import { IconBadge } from '@/components/elements/icon-badge';
import { Switch } from '@/components/ui/switch';

type TFormData = {
    wallet_id: string;
    category_id: string;
    type: string;
    amount: string;
    name: string;
    notes: string;
    frequency: string;
    next_due_at: string;
    is_active: boolean;
};

export const RecurringTransactionForm = ({
    recurring,
    wallets,
    categories,
}: {
    recurring?: TRecurringTransaction;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    const { data, setData, post, patch, processing, errors } =
        useForm<TFormData>({
            wallet_id: recurring?.wallet_id ?? '',
            category_id: recurring?.category_id ?? '',
            type: recurring?.type ?? 'expense',
            amount: recurring?.amount?.toString() ?? '',
            name: recurring?.name ?? '',
            notes: recurring?.notes ?? '',
            frequency: recurring?.frequency ?? 'monthly',
            next_due_at: recurring?.next_due_at ?? '',
            is_active: recurring?.is_active ?? true,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (recurring) {
            patch(route('recurring-transactions.update', recurring.id));
        } else {
            post(route('recurring-transactions.store'));
        }
    };

    const filteredCategories = categories.filter(
        (c) => c.type === data.type || data.type === '',
    );

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
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

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={data.type}
                        onValueChange={(v) => {
                            setData('type', v ?? '');
                            setData('category_id', '');
                        }}
                    >
                        <SelectTrigger id="type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        placeholder="0.00"
                    />
                    <InputError message={errors.amount} />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="wallet_id">Wallet</Label>
                <Select
                    value={data.wallet_id}
                    onValueChange={(v) => setData('wallet_id', v ?? '')}
                >
                    <SelectTrigger id="wallet_id">
                        <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                        {wallets.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                                <div className="flex items-center gap-2">
                                    <IconBadge
                                        icon={w.icon}
                                        color={w.color}
                                        size="sm"
                                    />
                                    {w.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.wallet_id} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="category_id">Category (optional)</Label>
                <Select
                    value={data.category_id}
                    onValueChange={(v) => setData('category_id', v ?? '')}
                >
                    <SelectTrigger id="category_id">
                        <SelectValue placeholder="No category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                                <div className="flex items-center gap-2">
                                    <IconBadge
                                        icon={c.icon}
                                        color={c.color}
                                        size="sm"
                                    />
                                    {c.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.category_id} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                        value={data.frequency}
                        onValueChange={(v) => setData('frequency', v ?? '')}
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
