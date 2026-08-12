import type {
    TCategory,
    TFile,
    TRecurringTransaction,
    TTransaction,
    TTransfer,
    TWallet,
} from './models';
import type { TCurrency } from './enums';

export type TWalletWithStats = TWallet & {
    balance: number;
    income: number;
    expense: number;
    net: number;
    transfers_in: number;
    transfers_out: number;
    transactions_count: number;
    transfers_count: number;
};

export type TTransterWithRelations = TTransfer & {
    from_wallet: TWallet;
    to_wallet: TWallet;
};

export type TRecurringTransactionWithRelations = TRecurringTransaction & {
    wallet: TWallet;
    category: TCategory | null;
};

export type TTransactionStat = {
    currency: TCurrency;
    count: number;
    income: number;
    expense: number;
    net: number;
};

export type TTransactionListItem = TTransaction & {
    wallet: TWallet;
    category: TCategory;
    files_count: number;
};

export type TTransactionWithRelations = TTransactionListItem & {
    files: TFile[];
};
