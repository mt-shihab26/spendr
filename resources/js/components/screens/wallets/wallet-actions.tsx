import {
    ActionsMenu,
    ActionsMenuSeparator,
    DeleteItem,
    EditItem,
    ViewItem,
} from '@/components/elements/actions-menu';

import type { TTableWallet } from '@/types/wallets';

import { WithTooltip } from '@/components/elements/with-tooltip';
import { TransactionsAction } from '@/components/elements/transactions-action';
import { TransfersAction } from '@/components/elements/transfers-action';

export const WalletActions = ({
    wallet,
    onDelete,
}: {
    wallet: TTableWallet;
    onDelete: (wallet: TTableWallet) => void;
}) => {
    const hasTransactions = (wallet.transactions_count ?? 0) > 0;

    return (
        <ActionsMenu>
            <ViewItem href={route('wallets.show', wallet.id)} />
            <EditItem href={route('wallets.edit', wallet.id)} />
            <TransactionsAction
                href={route('transactions.index', { wallet_id: wallet.id })}
                count={wallet.transactions_count}
            />
            <TransfersAction
                href={route('transfers.index', { wallet_id: wallet.id })}
                count={wallet.transfers_count}
            />
            <ActionsMenuSeparator />
            {hasTransactions ? (
                <WithTooltip
                    content="Reassign or delete all transactions first."
                    className="w-full"
                >
                    <DeleteItem onClick={() => {}} disabled />
                </WithTooltip>
            ) : (
                <DeleteItem onClick={() => onDelete(wallet)} />
            )}
        </ActionsMenu>
    );
};
