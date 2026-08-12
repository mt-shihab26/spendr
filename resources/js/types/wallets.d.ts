import type { TWallet } from './models';

export type TTableWallet = TWallet & {
    balance: number;
    income: number;
    expense: number;
    net: number;
    transfers_in: number;
    transfers_out: number;
    transactions_count: number;
    transfers_count: number;
};
