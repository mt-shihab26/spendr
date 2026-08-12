import type { TWallet } from '@/types/models';
import type { TTransterWithWallets } from '@/types/withs';

import { Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { TransferForm } from '@/components/screens/transfers/transfer-form';
import { TransferDeleteDialog } from '@/components/screens/transfers/transfer-delete-dialog';

const TransfersEdit = ({
    wallets,
    transfer,
}: {
    wallets: TWallet[];
    transfer: TTransterWithWallets;
}) => {
    return (
        <AppLayout
            title="Edit Transfer"
            description="Update transfer details"
            breadcrumbs={[
                {
                    title: 'Transfers',
                    route: 'transfers.index',
                },
                {
                    title: transfer.id,
                    route: 'transfers.show',
                    params: { transfer: transfer.id },
                },
                {
                    title: 'Edit',
                    route: 'transfers.edit',
                    params: { transfer: transfer.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading title="Edit Transfer" description={`Transfer #${transfer.id}`} />
                    <BackButton href={route('transfers.show', transfer.id)} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <TransferForm transfer={transfer} wallets={wallets} />
                    <div className="mt-6 border-t pt-4">
                        <TransferDeleteDialog
                            transfer={transfer}
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete Transfer
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TransfersEdit;
