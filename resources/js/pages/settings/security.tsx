import type { TManagePasskeysProps } from '@/components/screens/settings/security/manage-passkeys';
import type { TManageTwoFactorProps } from '@/components/screens/settings/security/manage-two-factor';

import { useRef } from 'react';

import { Form } from '@inertiajs/react';
import { InputError } from '@/components/elements/input-error';
import { ManagePasskeys } from '@/components/screens/settings/security/manage-passkeys';
import { PasswordInput } from '@/components/elements/password-input';
import { ManageTwoFactor } from '@/components/screens/settings/security/manage-two-factor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SettingsLayout } from '@/components/layouts/settings-layout';

const Security = (
    props: {
        passwordRules: string;
    } & TManagePasskeysProps &
        TManageTwoFactorProps,
) => {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <SettingsLayout
            title="Security settings"
            description="Manage your password and account security"
            breadcrumbs={[
                { title: 'Security settings', href: route('security.edit') },
            ]}
        >
            <Form
                action={route('user-password.update')}
                method="put"
                options={{ preserveScroll: true }}
                resetOnError={[
                    'password',
                    'password_confirmation',
                    'current_password',
                ]}
                resetOnSuccess
                onError={(errors) => {
                    if (errors.password) {
                        passwordInput.current?.focus();
                    }

                    if (errors.current_password) {
                        currentPasswordInput.current?.focus();
                    }
                }}
                className="space-y-6"
            >
                {({ errors, processing }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">
                                Current password
                            </Label>

                            <PasswordInput
                                id="current_password"
                                ref={currentPasswordInput}
                                name="current_password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Current password"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New password</Label>

                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                name="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="New password"
                                passwordrules={props.passwordRules}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>

                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                passwordrules={props.passwordRules}
                            />

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-password-button"
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </SettingsLayout>
    );
};

export default Security;
