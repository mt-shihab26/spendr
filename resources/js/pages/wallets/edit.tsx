import type { TWallet } from '@/types/models';

import { useState } from 'react';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { WalletForm } from '@/components/screens/wallets/wallet-form';
import { WalletDeleteDialog } from '@/components/screens/wallets/wallet-delete-dialog';
import { Button } from '@/components/ui/button';

const WalletsEdit = ({ wallet }: { wallet: TWallet }) => {
    const [open, setOpen] = useState(false);

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
                <Heading
                    title="Edit Wallet"
                    description="Update account details"
                />
                <div className="max-w-lg border p-4">
                    <WalletForm wallet={wallet} />
                    <div className="mt-6 border-t pt-4">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash2 />
                            Delete Wallet
                        </Button>
                        <WalletDeleteDialog
                            wallet={wallet}
                            open={open}
                            onOpenChange={setOpen}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsEdit;
