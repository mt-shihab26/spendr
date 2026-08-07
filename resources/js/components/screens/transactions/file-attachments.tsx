import type { TFile, TTransaction } from '@/types/models';

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Paperclip, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentUploader } from './attachment-uploader';

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SavedFileRow = ({
    file,
    readonly,
}: {
    file: TFile;
    readonly: boolean;
}) => {
    const { delete: destroy, processing } = useForm({});

    const isImage = file.mime_type.startsWith('image/');

    return (
        <li className="flex items-center gap-3 rounded border p-2 text-sm">
            {isImage ? (
                <img
                    src={route('files.show', file.id)}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                </p>
            </div>
            <div className="flex items-center gap-1">
                <a
                    href={route('files.show', file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                    </Button>
                </a>
                {!readonly && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                            if (!confirm(`Remove "${file.name}"?`)) return;
                            destroy(route('files.destroy', file.id));
                        }}
                        disabled={processing}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </li>
    );
};

type PendingFile = { id: string; name: string; size: number };

export const FileAttachments = ({
    transaction,
    readonly = false,
    onFileIdsChange,
}: {
    transaction?: TTransaction;
    readonly?: boolean;
    onFileIdsChange?: (ids: string[]) => void;
}) => {
    const savedFiles = transaction?.files ?? [];

    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const { setData, post, processing, errors, reset } = useForm<{
        file: File | null;
    }>({ file: null });

    const uploadForTransaction = (file: File) => {
        setData('file', file);
        post(route('transactions.files.store', transaction!.id), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const preUpload = async (file: File) => {
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

            const uploaded = (await response.json()) as PendingFile & {
                mime_type: string;
            };
            const next = [...pendingFiles, uploaded];
            setPendingFiles(next);
            onFileIdsChange?.(next.map((f) => f.id));
        } catch {
            setUploadError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removePending = (id: string) => {
        const next = pendingFiles.filter((f) => f.id !== id);
        setPendingFiles(next);
        onFileIdsChange?.(next.map((f) => f.id));
    };

    const isUploading = uploading || processing;

    return (
        <div className="border p-4">
            <div className="mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                    Attachments ({savedFiles.length + pendingFiles.length})
                </p>
            </div>

            {savedFiles.length === 0 && pendingFiles.length === 0 && readonly && (
                <p className="text-sm text-muted-foreground">No attachments.</p>
            )}

            {savedFiles.length > 0 && (
                <ul className={pendingFiles.length > 0 || !readonly ? 'mb-3 space-y-2' : 'space-y-2'}>
                    {savedFiles.map((file) => (
                        <SavedFileRow
                            key={file.id}
                            file={file}
                            readonly={readonly}
                        />
                    ))}
                </ul>
            )}

            {pendingFiles.length > 0 && (
                <ul className="mb-3 space-y-2">
                    {pendingFiles.map((f) => (
                        <li
                            key={f.id}
                            className="flex items-center gap-3 rounded border p-2 text-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{f.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(f.size)}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removePending(f.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {!readonly && (
                <AttachmentUploader
                    onFile={transaction ? uploadForTransaction : (f) => void preUpload(f)}
                    processing={isUploading}
                    error={errors.file ?? uploadError ?? undefined}
                />
            )}
        </div>
    );
};
