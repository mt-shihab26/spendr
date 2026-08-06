import type { TWallet } from '@/types/models';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { TransferForm } from '@/components/screens/transfers/transfer-form';

const TransfersCreate = ({ wallets }: { wallets: TWallet[] }) => {
    return (
        <AppLayout
            title="New Transfer"
            description="Move funds between wallets"
            breadcrumbs={[
                { title: 'Transfers', route: 'transfers.index' },
                { title: 'New Transfer', route: 'transfers.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Transfer"
                        description="Move funds between wallets"
                    />
                    <BackButton href={route('transfers.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <TransferForm wallets={wallets} />
                </div>
            </div>
        </AppLayout>
    );
};

export default TransfersCreate;
