import { usePage } from '@inertiajs/react';

import { Form } from '@inertiajs/react';
import { InputError } from '@/components/elements/input-error';
import { Link } from '@inertiajs/react';
import { DeleteUser } from '@/components/screens/settings/profile/delete-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsLayout } from '@/components/layouts/settings-layout';

const Profile = ({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) => {
    const { user } = usePage().props.auth;

    return (
        <SettingsLayout
            title="Profile settings"
            description="Update your name and email address"
            breadcrumbs={[{ title: 'Profile', route: 'settings.profile.edit' }]}
        >
            <Form
                action={route('settings.profile.update')}
                method="patch"
                options={{ preserveScroll: true }}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                defaultValue={user.name}
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                defaultValue={user.email}
                                name="email"
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </Form>
            <DeleteUser />
        </SettingsLayout>
    );
};

export default Profile;
