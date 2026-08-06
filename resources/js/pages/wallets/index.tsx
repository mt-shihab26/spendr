import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TWallet } from '@/types/models';
import type { TStat } from '@/components/screens/wallets/wallet-stats';

import { Wallet } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { WalletsTable } from '@/components/screens/wallets/wallets-table';
import { WalletStats } from '@/components/screens/wallets/wallet-stats';

const WalletsIndex = ({
    wallets,
    stats,
}: {
    wallets: TWallet[];
    stats: TStat[];
}) => {
    return (
        <AppLayout
            title="Wallets"
            description="Manage your accounts and balances"
            breadcrumbs={[{ title: 'Wallets', route: 'wallets.index' }]}
        >
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Wallets (${wallets.length})`}
                        description="Manage your accounts and balances"
                    />
                    <NewButton href={route('wallets.create')}>
                        New Wallet
                    </NewButton>
                </div>
                {wallets.length === 0 ? (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia>
                                <Wallet />
                            </EmptyMedia>
                            <EmptyTitle>No wallets yet</EmptyTitle>
                            <EmptyDescription>
                                Create your first wallet to start tracking your
                                finances.
                            </EmptyDescription>
                        </EmptyHeader>
                        <NewButton href={route('wallets.create')}>
                            Create your first wallet
                        </NewButton>
                    </Empty>
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
