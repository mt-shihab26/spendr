import {
    localToUtcDatetime,
    utcToLocalDatetimeInput,
    nowUtcIso,
    normalizeUtcIso,
} from '@/lib/date';

import type { TTransaction, TWallet, TCategory } from '@/types/models';
import type { TType } from '@/types/enums';

import { useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';
import { useForm } from '@inertiajs/react';

import { Link } from '@inertiajs/react';
import { Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputError } from '@/components/elements/input-error';
import { NumberInput } from '@/components/elements/number-input';
import { TypePicker } from '@/components/elements/type-picker';
import { Textarea } from '@/components/ui/textarea';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';
import { AttachmentUploader } from './attachment-uploader';
import { FileAttachments } from './file-attachments';

type UploadedFile = {
    id: string;
    name: string;
    size: number;
    mime_type: string;
};

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const TransactionForm = ({
    transaction,
    wallets,
    categories,
}: {
    transaction?: TTransaction;
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    const { data, setData, post, patch, processing, errors } = useForm<{
        wallet_id: string | null;
        category_id: string | null;
        type: TType;
        amount: number;
        transacted_at: string;
        description: string;
        notes: string;
        file_ids: string[];
    }>({
        wallet_id:
            transaction?.wallet_id ??
            wallets.find((w) => w.is_default)?.id ??
            null,
        category_id: transaction?.category_id ?? null,
        type: (transaction?.type ?? 'expense') as TType,
        amount: transaction?.amount ?? 0,
        transacted_at: transaction?.transacted_at
            ? normalizeUtcIso(transaction.transacted_at)
            : nowUtcIso(),
        description: transaction?.description ?? '',
        notes: transaction?.notes ?? '',
        file_ids: [],
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File) => {
        setUploadError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrf =
                document.querySelector<HTMLMetaElement>(
                    'meta[name="csrf-token"]',
                )?.content ?? '';

            const response = await fetch(route('files.store'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            if (!response.ok) {
                const json = (await response
                    .json()
                    .catch(() => ({}))) as { message?: string };
                setUploadError(json.message ?? 'Upload failed.');
                return;
            }

            const uploaded = (await response.json()) as UploadedFile;
            setUploadedFiles((prev) => [...prev, uploaded]);
            setData('file_ids', [...data.file_ids, uploaded.id]);
        } catch {
            setUploadError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (id: string) => {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
        setData('file_ids', data.file_ids.filter((fid) => fid !== id));
    };

    const selectedWallet = wallets.find((w) => w.id === data.wallet_id);
    const currencyPrefix = selectedWallet
        ? getCurrencySymbol(selectedWallet.currency)
        : '';

    return (
        <form
            className="space-y-5"
            onSubmit={(e) => {
                e.preventDefault();
                if (transaction) {
                    patch(route('transactions.update', transaction));
                } else {
                    post(route('transactions.store'));
                }
            }}
        >
            <div className="space-y-2">
                <Label>
                    Type <span className="text-destructive">*</span>
                </Label>
                <TypePicker
                    value={data.type}
                    onChange={(type) => {
                        setData((prev) => ({
                            ...prev,
                            type,
                            category_id: '',
                        }));
                    }}
                    disabled={!!transaction}
                />
                <InputError message={errors.type} />
            </div>

            <div className="space-y-2">
                <Label>
                    Wallet <span className="text-destructive">*</span>
                </Label>
                <WalletSelect
                    wallets={wallets}
                    value={data.wallet_id}
                    onValueChange={(value) => setData('wallet_id', value)}
                    disabled={!!transaction}
                />
                <InputError message={errors.wallet_id} />
            </div>

            <div className="space-y-2">
                <Label>
                    Amount <span className="text-destructive">*</span>
                </Label>
                <NumberInput
                    value={data.amount}
                    onValueChange={({ value }) =>
                        setData('amount', Number(value))
                    }
                    prefix={currencyPrefix}
                />
                <InputError message={errors.amount} />
            </div>

            <div className="space-y-2">
                <Label>
                    Category <span className="text-destructive">*</span>
                </Label>
                <CategorySelect
                    categories={categories}
                    type={data.type}
                    value={data.category_id}
                    onValueChange={(value) => setData('category_id', value)}
                />
                <InputError message={errors.category_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="e.g. Grocery shopping"
                    required
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="transacted_at">
                    Date <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="transacted_at"
                    type="datetime-local"
                    value={utcToLocalDatetimeInput(data.transacted_at)}
                    onChange={(e) =>
                        setData(
                            'transacted_at',
                            localToUtcDatetime(e.target.value),
                        )
                    }
                    required
                />
                <InputError message={errors.transacted_at} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Optional notes"
                />
                <InputError message={errors.notes} />
            </div>

            {transaction && (
                <FileAttachments transaction={transaction} />
            )}

            {!transaction && (
                <div className="space-y-2">
                    <Label>Attachments</Label>

                    {uploadedFiles.length > 0 && (
                        <ul className="space-y-2">
                            {uploadedFiles.map((f) => (
                                <li
                                    key={f.id}
                                    className="flex items-center gap-3 rounded border p-2 text-sm"
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-muted">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium">
                                            {f.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(f.size)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive"
                                        onClick={() => removeFile(f.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <AttachmentUploader
                        onFile={(file) => void uploadFile(file)}
                        processing={uploading}
                        error={uploadError ?? undefined}
                    />
                </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2">
                <Button
                    variant="outline"
                    type="button"
                    render={<Link href={route('transactions.index')} />}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing || uploading}>
                    {!transaction ? 'Create Transaction' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};
