import type { TWallet } from '@/types/models';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { WalletForm } from '@/components/screens/wallets/wallet-form';
import { WalletDeleteDialog } from '@/components/screens/wallets/wallet-delete-dialog';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';

const WalletsEdit = ({ wallet }: { wallet: TWallet }) => {
    return (
        <AppLayout
            title="Edit Wallet"
            description="Update account details"
            breadcrumbs={[
                {
                    title: 'Wallets',
                    route: 'wallets.index',
                },
                {
                    title: wallet.name,
                    route: 'wallets.show',
                    params: { wallet: wallet.id },
                },
                {
                    title: 'Edit',
                    route: 'wallets.edit',
                    params: { wallet: wallet.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Edit Wallet"
                        description="Update account details"
                    />
                    <BackButton href={route('wallets.show', wallet.id)} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <WalletForm wallet={wallet} />
                    <div className="mt-6 border-t pt-4">
                        <WalletDeleteDialog
                            wallet={wallet}
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete Wallet
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsEdit;
