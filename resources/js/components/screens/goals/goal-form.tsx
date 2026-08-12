import type { TGoal } from '@/types/models';

import { useForm, usePage } from '@inertiajs/react';
import { CURRENCIES_OPTIONS } from '@/lib/currency';

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

type TGoalFormData = {
    name: string;
    description: string;
    currency: string;
    target_amount: string;
    current_amount: string;
    target_date: string;
    icon: string;
    color: string;
};

export const GoalForm = ({ goal }: { goal?: TGoal }) => {
    const { preferences } = usePage().props;
    const { data, setData, post, patch, processing, errors } =
        useForm<TGoalFormData>({
            name: goal ? (goal?.name ?? null) : '',
            description: goal ? (goal?.description ?? '') : '',
            currency: goal ? (goal?.currency ?? null) : preferences.default_currency,
            target_amount: goal ? (goal?.target_amount?.toString() ?? null) : '',
            current_amount: goal ? (goal?.current_amount?.toString() ?? null) : '0',
            target_date: goal ? (goal?.target_date ?? '') : '',
            icon: goal ? (goal?.icon ?? '') : '',
            color: goal ? (goal?.color ?? null) : '#6366f1',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (goal) {
            patch(route('goals.update', goal.id));
        } else {
            post(route('goals.store'));
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Emergency fund"
                />
                <InputError message={errors.name} />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="What is this goal for?"
                    rows={2}
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="currency">
                        Currency <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.currency}
                        onValueChange={(v) => setData('currency', v ?? '')}
                    >
                        <SelectTrigger id="currency">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES_OPTIONS.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.currency} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="color">Color</Label>
                    <Input
                        id="color"
                        type="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="h-10 cursor-pointer p-1"
                    />
                    <InputError message={errors.color} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="target_amount">
                        Target Amount <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="target_amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={data.target_amount}
                        onChange={(e) =>
                            setData('target_amount', e.target.value)
                        }
                        placeholder="10000.00"
                    />
                    <InputError message={errors.target_amount} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="current_amount">Current Amount</Label>
                    <Input
                        id="current_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.current_amount}
                        onChange={(e) =>
                            setData('current_amount', e.target.value)
                        }
                        placeholder="0.00"
                    />
                    <InputError message={errors.current_amount} />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="target_date">Target Date</Label>
                <Input
                    id="target_date"
                    type="date"
                    value={data.target_date}
                    onChange={(e) => setData('target_date', e.target.value)}
                />
                <InputError message={errors.target_date} />
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing
                    ? 'Saving...'
                    : goal
                      ? 'Update Goal'
                      : 'Create Goal'}
            </Button>
        </form>
    );
};
