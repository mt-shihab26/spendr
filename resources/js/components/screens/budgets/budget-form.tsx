import type { TBudget, TCategory } from '@/types/models';

import { useForm } from '@inertiajs/react';
import { getCurrencySymbol } from '@/lib/currency';

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { CategorySelect } from '@/components/elements/category-select';

import { CURRENCIES_OPTIONS } from '@/lib/currency';

export const BudgetForm = ({
    budget,
    categories,
}: {
    budget?: TBudget;
    categories: TCategory[];
}) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        category_id: budget?.category_id ?? null,
        amount: budget?.amount ?? ({} as TBudget['amount']),
    });

    return (
        <form
            className="space-y-5"
            onSubmit={(e) => {
                e.preventDefault();
                if (budget) {
                    patch(route('budgets.update', budget));
                } else {
                    post(route('budgets.store'));
                }
            }}
        >
            <div className="space-y-2">
                <Label>
                    Category <span className="text-destructive">*</span>
                </Label>
                <CategorySelect
                    categories={categories}
                    type="expense"
                    value={data.category_id}
                    onValueChange={(value) => setData('category_id', value)}
                    disabled={!!budget}
                />
                <InputError message={errors.category_id} />
            </div>

            {CURRENCIES_OPTIONS.map((currency) => (
                <div className="space-y-2" key={currency}>
                    <Label>
                        Monthly Limit ({currency})
                        <span className="text-destructive">*</span>
                    </Label>
                    <NumberInput
                        value={data.amount?.[currency] ?? ''}
                        prefix={getCurrencySymbol(currency)}
                        onValueChange={({ value }) =>
                            setData('amount', {
                                ...data.amount,
                                [currency]: Number(value),
                            })
                        }
                    />
                    <InputError message={errors.amount} />
                </div>
            ))}

            <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                    variant="outline"
                    type="button"
                    nativeButton={false}
                    render={<Link href={route('budgets.index')} />}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {!budget ? 'Create Budget' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
