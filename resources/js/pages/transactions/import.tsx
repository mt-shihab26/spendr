import type { TWallet, TCategory } from '@/types/models';

import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { Button } from '@/components/ui/button';
import { WalletSelect } from '@/components/elements/wallet-select';
import { CategorySelect } from '@/components/elements/category-select';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const TransactionsImport = ({
    wallets,
    categories,
}: {
    wallets: TWallet[];
    categories: TCategory[];
}) => {
    const { data, setData, post, processing, errors } = useForm<{
        file: File | null;
        wallet_id: string;
        col_date: string;
        col_description: string;
        col_amount: string;
        col_type: string;
        col_category: string;
        default_type: string;
        default_category_id: string;
        skip_header: boolean;
    }>({
        file: null,
        wallet_id: wallets[0]?.id ?? '',
        col_date: '0',
        col_description: '1',
        col_amount: '2',
        col_type: '',
        col_category: '',
        default_type: 'expense',
        default_category_id: '',
        skip_header: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('transactions.import.store'), {
            forceFormData: true,
        });
    };

    const colOptions = Array.from({ length: 10 }, (_, i) => ({
        label: `Column ${i + 1}`,
        value: String(i),
    }));

    return (
        <AppLayout
            title="Import Transactions"
            description="Import transactions from a CSV file"
            breadcrumbs={[
                { title: 'Transactions', route: 'transactions.index' },
                { title: 'Import', route: 'transactions.import' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Import Transactions"
                        description="Upload a CSV file to bulk import transactions"
                    />
                    <BackButton href={route('transactions.index')} />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto w-full max-w-lg"
                >
                    <div className="flex flex-col gap-4 border p-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">
                                CSV File
                            </label>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={(e) =>
                                    setData('file', e.target.files?.[0] ?? null)
                                }
                                className="text-xs"
                            />
                            {errors.file && (
                                <p className="text-xs text-destructive">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="skip_header"
                                checked={data.skip_header}
                                onChange={(e) =>
                                    setData('skip_header', e.target.checked)
                                }
                            />
                            <label htmlFor="skip_header" className="text-xs">
                                First row is header (use column names)
                            </label>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">
                                Wallet
                            </label>
                            <WalletSelect
                                wallets={wallets}
                                value={data.wallet_id}
                                onValueChange={(v) =>
                                    setData('wallet_id', v ?? '')
                                }
                            />
                            {errors.wallet_id && (
                                <p className="text-xs text-destructive">
                                    {errors.wallet_id}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Date column
                                </label>
                                <input
                                    type="text"
                                    placeholder={
                                        data.skip_header ? 'Column name' : '0'
                                    }
                                    value={data.col_date}
                                    onChange={(e) =>
                                        setData('col_date', e.target.value)
                                    }
                                    className="border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Description column
                                </label>
                                <input
                                    type="text"
                                    placeholder={
                                        data.skip_header ? 'Column name' : '1'
                                    }
                                    value={data.col_description}
                                    onChange={(e) =>
                                        setData(
                                            'col_description',
                                            e.target.value,
                                        )
                                    }
                                    className="border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Amount column
                                </label>
                                <input
                                    type="text"
                                    placeholder={
                                        data.skip_header ? 'Column name' : '2'
                                    }
                                    value={data.col_amount}
                                    onChange={(e) =>
                                        setData('col_amount', e.target.value)
                                    }
                                    className="border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Type column (optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="income/expense column"
                                    value={data.col_type}
                                    onChange={(e) =>
                                        setData('col_type', e.target.value)
                                    }
                                    className="border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Category column (optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="category name column"
                                    value={data.col_category}
                                    onChange={(e) =>
                                        setData('col_category', e.target.value)
                                    }
                                    className="border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t pt-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Default type
                                </label>
                                <Select
                                    value={data.default_type}
                                    onValueChange={(v) =>
                                        setData('default_type', v ?? '')
                                    }
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="expense">
                                            Expense
                                        </SelectItem>
                                        <SelectItem value="income">
                                            Income
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">
                                    Default category
                                </label>
                                <CategorySelect
                                    categories={categories}
                                    value={data.default_category_id}
                                    onValueChange={(v) =>
                                        setData('default_category_id', v ?? '')
                                    }
                                />
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Amounts are always treated as positive. Currency
                            symbols are stripped automatically. Rows with blank
                            description or zero amount are skipped.
                        </p>

                        <Button
                            type="submit"
                            disabled={processing || !data.file}
                        >
                            {processing ? 'Importing…' : 'Import'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default TransactionsImport;
