import type { TWallet } from '@/types/models';

import { getCurrencySymbol } from '@/lib/currency';
import { getIcon } from '@/lib/icons';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { TransactionsButton } from '@/components/elements/transactions-button';
import { Balance } from '@/components/elements/balance';
import { InitialBalance } from '@/components/elements/initial-balance';
import { Income } from '@/components/elements/income';
import { Expense } from '@/components/elements/expense';
import { TransferIn } from '@/components/elements/transfer-in';
import { TransferOut } from '@/components/elements/transfer-out';
import { Net } from '@/components/elements/net';
import { TransactionCount } from '@/components/elements/transaction-count';

type TShowWallet = TWallet & {
    balance: number;
    income: number;
    expense: number;
    transfers_in: number;
    transfers_out: number;
    net: number;
    transactions_count: number;
};

const WalletsShow = ({ wallet }: { wallet: TShowWallet }) => {
    const walletTitle = `'${wallet.name}' Wallet`;
    const hasTransfers = wallet.transfers_in > 0 || wallet.transfers_out > 0;

    return (
        <AppLayout
            title={walletTitle}
            description={wallet.name}
            breadcrumbs={[
                {
                    title: 'Wallets',
                    route: 'wallets.index',
                },
                {
                    title: wallet.name,
                    route: 'wallets.show',
                    params: { wallet: wallet.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={walletTitle}
                        description={`${getCurrencySymbol(wallet.currency)} ${wallet.currency}${wallet.is_default ? ' · Default wallet' : ''}`}
                        icon={getIcon(wallet.icon)}
                        color={wallet.color}
                    />
                    <div className="flex items-center gap-2">
                        <TransactionsButton href={route('transactions.index', { wallet_id: wallet.id })} />
                        <EditButton href={route('wallets.edit', wallet.id)} />
                        <BackButton href={route('wallets.index')} />
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <Balance balance={wallet.balance} currency={wallet.currency} />
                    </div>
                    <div className="w-full border p-4">
                        <InitialBalance amount={wallet.initial_balance} currency={wallet.currency} />
                    </div>
                    <div className="w-full border p-4">
                        <Net net={wallet.net} currency={wallet.currency} />
                    </div>
                    <div className="w-full border p-4">
                        <TransactionCount count={wallet.transactions_count} />
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-full border p-4">
                        <Income income={wallet.income} currency={wallet.currency} />
                    </div>
                    <div className="w-full border p-4">
                        <Expense expense={wallet.expense} currency={wallet.currency} />
                    </div>
                </div>

                {hasTransfers && (
                    <div className="flex w-full gap-4">
                        {wallet.transfers_in > 0 && (
                            <div className="w-full border p-4">
                                <TransferIn amount={wallet.transfers_in} currency={wallet.currency} />
                            </div>
                        )}
                        {wallet.transfers_out > 0 && (
                            <div className="w-full border p-4">
                                <TransferOut amount={wallet.transfers_out} currency={wallet.currency} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default WalletsShow;
