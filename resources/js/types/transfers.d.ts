import type { TTransfer, TWallet } from './models';

export type TTableTranster = TTransfer & {
    from_wallet: TWallet;
    to_wallet: TWallet;
};
