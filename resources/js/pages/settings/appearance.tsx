import { Head, setLayoutProps } from '@inertiajs/react';
import AppearanceTabs from '@/components/elements/appearance-tabs';
import { Heading } from '@/components/elements/heading';

export default function Appearance() {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Appearance settings', href: route('appearance.edit') },
        ],
    });

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update the appearance settings for your account"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}
