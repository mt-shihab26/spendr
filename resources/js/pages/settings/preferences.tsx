import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/elements/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SettingsLayout } from '@/components/layouts/settings-layout';

type TPreferences = {
    default_currency: string;
    first_day_of_week: string;
};

const Preferences = ({
    preferences,
    currencies,
}: {
    preferences: TPreferences;
    currencies: string[];
}) => {
    const { data, setData, patch, processing, errors } =
        useForm<TPreferences>(preferences);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.preferences.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout
            title="Preferences"
            description="Set your default currency and display options"
            breadcrumbs={[
                {
                    title: 'Preferences',
                    route: 'settings.preferences.edit',
                },
            ]}
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="default_currency">Default currency</Label>
                    <Select
                        value={data.default_currency}
                        onValueChange={(v) =>
                            setData(
                                'default_currency',
                                v ?? data.default_currency,
                            )
                        }
                    >
                        <SelectTrigger id="default_currency" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start">
                            {currencies.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.default_currency} />
                </div>

                <div className="grid gap-2">
                    <Label>First day of week</Label>
                    <RadioGroup
                        value={data.first_day_of_week}
                        onValueChange={(v) => setData('first_day_of_week', v)}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                    >
                        {[
                            { value: 'sunday', label: 'Sunday' },
                            { value: 'monday', label: 'Monday' },
                            { value: 'tuesday', label: 'Tuesday' },
                            { value: 'wednesday', label: 'Wednesday' },
                            { value: 'thursday', label: 'Thursday' },
                            { value: 'friday', label: 'Friday' },
                            { value: 'saturday', label: 'Saturday' },
                        ].map((opt) => (
                            <div
                                key={opt.value}
                                className="flex items-center gap-2"
                            >
                                <RadioGroupItem
                                    id={`week_${opt.value}`}
                                    value={opt.value}
                                />
                                <Label
                                    htmlFor={`week_${opt.value}`}
                                    className="cursor-pointer font-normal"
                                >
                                    {opt.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <InputError message={errors.first_day_of_week} />
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        Save
                    </Button>
                </div>
            </form>
        </SettingsLayout>
    );
};

export default Preferences;
