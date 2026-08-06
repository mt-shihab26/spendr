import type { LucideIcon } from 'lucide-react';
import type { TAppearance } from '@/hooks/use-appearance';

import { useAppearance } from '@/hooks/use-appearance';

import { Monitor, Moon, Sun } from 'lucide-react';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Appearance = () => {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: TAppearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    const changeAppearance = (value: string | null) => {
        if (value === 'light' || value === 'dark' || value === 'system') {
            updateAppearance(value);
        }
    };

    return (
        <SettingsLayout
            title="Appearance settings"
            description="Update the appearance settings for your account"
            breadcrumbs={[
                {
                    title: 'Appearance',
                    route: 'settings.appearance.edit',
                },
            ]}
        >
            <Tabs value={appearance} onValueChange={changeAppearance}>
                <TabsList>
                {tabs.map(({ value, icon: Icon, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                    >
                        <Icon />
                        {label}
                    </TabsTrigger>
                ))}
                </TabsList>
            </Tabs>
        </SettingsLayout>
    );
};

export default Appearance;
