import type { TCategory } from '@/types/models';
import type { TType } from '@/types/enums';

import { useForm } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { TypePicker } from '@/components/screens/categories/type-picker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/elements/input-error';
import { ColorPicker } from '@/components/elements/color-picker';
import { IconPicker } from '@/components/elements/icon-picker';
import { Label } from '@/components/ui/label';

export const CategoryForm = ({ category }: { category?: TCategory }) => {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: category?.name ?? '',
        type: (category?.type ?? 'expense') as TType,
        color: category?.color ?? '#6366f1',
        icon: category?.icon ?? '',
        is_default: category?.is_default ?? false,
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (category) {
                    patch(route('categories.update', category));
                } else {
                    post(route('categories.store'));
                }
            }}
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label htmlFor="category-name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="category-name"
                    name="category-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Food, Salary"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label>
                    Type <span className="text-destructive">*</span>
                </Label>
                <TypePicker
                    value={data.type}
                    onChange={(type) => setData('type', type)}
                />
                <InputError message={errors.type} />
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
                    Set as default category
                </Label>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                    variant="outline"
                    type="button"
                    render={<Link href={route('categories.index')} />}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {!category ? 'Create Category' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
