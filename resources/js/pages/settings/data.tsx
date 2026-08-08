import { Button } from '@/components/ui/button';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import {
    Download,
    Wallet,
    Tags,
    ArrowLeftRight,
    Target,
    PiggyBank,
    RefreshCw,
    ReceiptText,
} from 'lucide-react';

const EXPORT_INCLUDES = [
    { icon: Wallet, label: 'Wallets' },
    { icon: Tags, label: 'Categories' },
    { icon: ReceiptText, label: 'Transactions' },
    { icon: ArrowLeftRight, label: 'Transfers' },
    { icon: Target, label: 'Goals' },
    { icon: PiggyBank, label: 'Budgets' },
    { icon: RefreshCw, label: 'Recurring transactions' },
];

const Data = () => {
    return (
        <SettingsLayout
            title="Data export"
            description="Download a copy of all your Spendr data"
            breadcrumbs={[
                {
                    title: 'Data',
                    route: 'settings.data.edit',
                },
            ]}
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Your export will include all of your data as CSV files
                        bundled in a single ZIP archive.
                    </p>

                    <ul className="grid grid-cols-2 gap-1.5">
                        {EXPORT_INCLUDES.map(({ icon: Icon, label }) => (
                            <li
                                key={label}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <Icon className="size-3.5 shrink-0" />
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>

                <Button asChild>
                    <a href={route('settings.data.export')}>
                        <Download />
                        Download my data
                    </a>
                </Button>
            </div>
        </SettingsLayout>
    );
};

export default Data;
