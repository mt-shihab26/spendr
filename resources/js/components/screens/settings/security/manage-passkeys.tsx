import type { TPasskey } from '@/components/screens/settings/security/passkey-item';

import { router } from '@inertiajs/react';

import { KeyRound } from 'lucide-react';
import { Heading } from '@/components/elements/heading';
import { PasskeyItem } from './passkey-item';
import { PasskeyRegistration } from './passkey-register';

const EmptyState = () => {
    return (
        <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <KeyRound className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">No passkeys yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Add a passkey to sign in without a password
            </p>
        </div>
    );
};

export type TManagePasskeysProps = {
    canManagePasskeys?: boolean;
    passkeys?: TPasskey[];
};

export const ManagePasskeys = (props: TManagePasskeysProps) => {
    const passkeys = props.passkeys ?? [];

    const handleDelete = (id: number, onError: () => void) => {
        router.delete(route('passkey.destroy', { passkey: id }), {
            preserveScroll: true,
            onError,
        });
    };

    const handleRegisterSuccess = () => {
        router.reload();
    };

    if (!(props.canManagePasskeys ?? false)) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Passkeys"
                description="Manage your passkeys for passwordless sign-in"
            />

            <div className="overflow-hidden rounded-lg border border-border">
                {passkeys.length > 0 ? (
                    passkeys.map((passkey) => (
                        <PasskeyItem
                            key={passkey.id}
                            passkey={passkey}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>

            <PasskeyRegistration onSuccess={handleRegisterSuccess} />
        </div>
    );
};
