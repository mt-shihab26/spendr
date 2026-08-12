import type { TTransfer, TWallet } from './models';

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

export type TTransterWithWallets = TTransfer & {
    from_wallet: TWallet;
    to_wallet: TWallet;
};
