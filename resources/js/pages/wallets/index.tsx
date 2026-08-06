import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import type { TWallet } from '@/types/models';

import { Link } from '@inertiajs/react';
import { Plus, Wallet } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { Button } from '@/components/ui/button';
import { NetWorth } from '@/components/screens/wallets/index/net-worth';
import { WalletsTable } from '@/components/screens/wallets/index/wallets-table';

const WalletsIndex = ({ wallets }: { wallets: TWallet[] }) => {
    return (
        <AppLayout
            title="Wallets"
            description="Manage your accounts and balances"
            breadcrumbs={[{ title: 'Wallets', route: 'wallets.index' }]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Wallets"
                        description="Manage your accounts and balances"
                    />
                    <Button render={<Link href={route('wallets.create')} />}>
                        <Plus />
                        New Wallet
                    </Button>
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
                        <Button
                            render={<Link href={route('wallets.create')} />}
                        >
                            <Plus />
                            Create your first wallet
                        </Button>
                    </Empty>
                ) : (
                    <>
                        <NetWorth wallets={wallets} />
                        <WalletsTable wallets={wallets} />
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default WalletsIndex;
