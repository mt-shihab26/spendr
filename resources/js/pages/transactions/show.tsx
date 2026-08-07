import type { TFile, TTransaction } from '@/types/models';

import { Link, useForm } from '@inertiajs/react';
import { formatLocalDateTimeLong } from '@/lib/date';
import { useState, useRef } from 'react';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { TransactionAmount } from '@/components/elements/transaction-amount';
import { Badge } from '@/components/ui/badge';
import { IconBadge } from '@/components/elements/icon-badge';
import { Button } from '@/components/ui/button';
import { Paperclip, Trash2, Download, Upload } from 'lucide-react';

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileRow = ({ file }: { file: TFile }) => {
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
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={processing}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </li>
    );
};

const FileAttachments = ({ transaction }: { transaction: TTransaction }) => {
    const files = transaction.files ?? [];
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const { setData, post, processing, errors, reset } = useForm<{
        file: File | null;
    }>({ file: null });

    const upload = (file: File) => {
        setData('file', file);
        post(route('transactions.files.store', transaction.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            upload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            upload(file);
        }
    };

    return (
        <div className="border p-4">
            <div className="mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                    Attachments ({files.length})
                </p>
            </div>

            {files.length > 0 && (
                <ul className="mb-4 space-y-2">
                    {files.map((file) => (
                        <FileRow key={file.id} file={file} />
                    ))}
                </ul>
            )}

            <div
                className={`flex cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed p-6 transition-colors ${
                    dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    {processing
                        ? 'Uploading...'
                        : 'Click or drag a file to attach'}
                </p>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG, PDF, WEBP up to 10 MB
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.webp"
                    onChange={handleFileChange}
                />
            </div>

            {errors.file && (
                <p className="mt-2 text-sm text-destructive">{errors.file}</p>
            )}
        </div>
    );
};

const TransactionsShow = ({ transaction }: { transaction: TTransaction }) => {
    return (
        <AppLayout
            title={transaction.description}
            description={transaction.description}
            breadcrumbs={[
                {
                    title: 'Transactions',
                    route: 'transactions.index',
                },
                {
                    title: transaction.description,
                    route: 'transactions.show',
                    params: { transaction: transaction.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={transaction.description}
                        description={formatLocalDateTimeLong(
                            transaction.transacted_at,
                        )}
                    />
                    <div className="flex items-center">
                        <EditButton
                            href={route('transactions.edit', transaction.id)}
                        />
                        <BackButton href={route('transactions.index')} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <TransactionAmount
                            transaction={transaction}
                            className="mt-1 text-lg font-semibold"
                        />
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                            {transaction.type}
                        </Badge>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Category
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            {transaction.category && (
                                <IconBadge
                                    icon={transaction.category.icon}
                                    color={transaction.category.color}
                                />
                            )}
                            {transaction.category ? (
                                <Link
                                    href={route(
                                        'categories.show',
                                        transaction.category.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {transaction.category.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium">—</span>
                            )}
                        </div>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Wallet</p>
                        <div className="mt-1 flex items-center gap-2">
                            {transaction.wallet && (
                                <IconBadge
                                    icon={transaction.wallet.icon}
                                    color={transaction.wallet.color}
                                />
                            )}
                            {transaction.wallet ? (
                                <Link
                                    href={route(
                                        'wallets.show',
                                        transaction.wallet.id,
                                    )}
                                    className="text-sm font-medium hover:underline"
                                >
                                    {transaction.wallet.name}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium">—</span>
                            )}
                        </div>
                    </div>
                </div>
                {transaction.notes && (
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="mt-1 text-sm">{transaction.notes}</p>
                    </div>
                )}
                <FileAttachments transaction={transaction} />
            </div>
        </AppLayout>
    );
};

export default TransactionsShow;
