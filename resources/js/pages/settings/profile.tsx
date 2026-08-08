import { useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Form } from '@inertiajs/react';
import { InputError } from '@/components/elements/input-error';
import { DeleteUser } from '@/components/screens/settings/profile/delete-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatInitial } from '@/lib/formats';

const AvatarUpload = () => {
    const { user } = usePage().props.auth;
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        avatar: File | null;
    }>({ avatar: null });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const submitAvatar = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.profile.avatar.update'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    return (
        <div className="flex items-start gap-5 pb-6 border-b">
            <Avatar className="size-20 text-2xl">
                <AvatarImage src={preview ?? user?.avatar} alt={user?.name} />
                <AvatarFallback>{formatInitial(user?.name ?? '')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <div>
                    <p className="text-sm font-medium">Profile picture</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        JPG, PNG or WebP — max 2 MB
                    </p>
                </div>

                <form onSubmit={submitAvatar} className="flex flex-wrap items-center gap-2">
                    <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="max-w-64 cursor-pointer text-xs"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={processing || !data.avatar}
                    >
                        Upload
                    </Button>
                    {user?.avatar && !preview && (
                        <Link
                            href={route('settings.profile.avatar.destroy')}
                            method="delete"
                            as="button"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                            >
                                Remove
                            </Button>
                        </Link>
                    )}
                </form>

                <InputError message={errors.avatar} />
            </div>
        </div>
    );
};

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
            <div className="space-y-6">
                <AvatarUpload />

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
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
            <DeleteUser />
        </SettingsLayout>
    );
};

export default Profile;
