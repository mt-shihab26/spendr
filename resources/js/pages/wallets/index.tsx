import type { TStatWallet } from '@/components/screens/wallets/wallet-stats';
import type { TTableWallet } from '@/types/wallets';

import { Wallet } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { WalletsTable } from '@/components/screens/wallets/wallets-table';
import { WalletStats } from '@/components/screens/wallets/wallet-stats';
import { EmptyState } from '@/components/elements/empty-state';

const WalletsIndex = ({
    stats,
    wallets,
}: {
    stats: TStatWallet[];
    wallets: TTableWallet[];
}) => {
    const title = `Wallets (${wallets.length})`;

    return (
        <AppLayout
            title={title}
            description="Manage your accounts and balances"
            breadcrumbs={[{ title: 'Wallets', route: 'wallets.index' }]}
        >
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={title}
                        description="Manage your accounts and balances"
                    />
                    <NewButton href={route('wallets.create')}>
                        New Wallet
                    </NewButton>
                </div>
                {wallets.length === 0 ? (
                    <EmptyState
                        icon={<Wallet />}
                        title="No wallets yet"
                        description="Create your first wallet to start tracking your finances."
                        href={route('wallets.create')}
                        action="Create your first wallet"
                    />
                ) : (
                    <>
                        <WalletStats stats={stats} />
                        <WalletsTable wallets={wallets} />
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default WalletsIndex;
