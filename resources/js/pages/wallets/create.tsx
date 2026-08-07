import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { WalletForm } from '@/components/screens/wallets/wallet-form';
import { BackButton } from '@/components/elements/back-button';

const WalletsCreate = () => {
    return (
        <AppLayout
            title="New Wallet"
            description="Add a new account to track"
            breadcrumbs={[
                { title: 'Wallets', route: 'wallets.index' },
                { title: 'New Wallet', route: 'wallets.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Wallet"
                        description="Add a new account to track"
                    />
                    <BackButton href={route('wallets.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <WalletForm />
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsCreate;
