import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { WalletForm } from '@/components/screens/wallets/wallet-form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { TWallet } from '@/types/models';

const WalletsEdit = ({ wallet }: { wallet: TWallet }) => {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('wallets.destroy', wallet.id));
    };

    return (
        <AppLayout
            title="Edit Wallet"
            description="Update account details"
            breadcrumbs={[
                { title: 'Wallets', route: 'wallets.index' },
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
                    <WalletForm
                        wallet={wallet}
                        action={route('wallets.update', wallet.id)}
                        method="patch"
                    />

                    <div className="mt-6 border-t pt-4">
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger
                                render={
                                    <Button variant="destructive" size="sm" />
                                }
                            >
                                <Trash2 />
                                Delete Wallet
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete "{wallet.name}"?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This cannot be undone. Reassign or
                                        delete all transactions first.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default WalletsEdit;
