import type { TFile, TTransaction } from '@/types/models';

import { useForm } from '@inertiajs/react';
import { Paperclip, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentUploader } from './attachment-uploader';

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileRow = ({
    file,
    readonly,
}: {
    file: TFile;
    readonly: boolean;
}) => {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (!confirm(`Remove "${file.name}"?`)) {
            return;
        }
        destroy(route('files.destroy', file.id));
    };

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
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </li>
    );
};

export const FileAttachments = ({
    transaction,
    readonly = false,
}: {
    transaction: TTransaction;
    readonly?: boolean;
}) => {
    const files = transaction.files ?? [];

    const { setData, post, processing, errors, reset } = useForm<{
        file: File | null;
    }>({ file: null });

    const upload = (file: File) => {
        setData('file', file);
        post(route('transactions.files.store', transaction.id), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="border p-4">
            <div className="mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                    Attachments ({files.length})
                </p>
            </div>

            {files.length > 0 ? (
                <ul className={readonly ? 'space-y-2' : 'mb-4 space-y-2'}>
                    {files.map((file) => (
                        <FileRow key={file.id} file={file} readonly={readonly} />
                    ))}
                </ul>
            ) : (
                readonly && (
                    <p className="text-sm text-muted-foreground">
                        No attachments.
                    </p>
                )
            )}

            {!readonly && (
                <AttachmentUploader
                    onFile={upload}
                    processing={processing}
                    error={errors.file}
                />
            )}
        </div>
    );
};
