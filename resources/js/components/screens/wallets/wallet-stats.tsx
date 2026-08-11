import type { TCurrency } from '@/types/enums';

import { formatCurrency } from '@/lib/formats';

import { Plus, Minus, ArrowDownLeft, ArrowUpRight, Equal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { StatItem } from '@/components/elements/stat-item';

export type TStatWallet = {
    currency: TCurrency;
    initial_balance: number;
    income: number;
    expense: number;
    net: number;
    balance: number;
    transfers_out: number;
    transfers_in: number;
};

const WalletBalance = ({ balance, currency }: { balance: number; currency: TCurrency }) => (
    <div className="min-w-28">
        <p className="text-xs text-muted-foreground">{currency} Balance</p>
        <p className="text-lg font-bold text-balance tabular-nums">
            {formatCurrency(balance, currency)}
        </p>
    </div>
);

const WalletIncome = ({ income, currency }: { income: number; currency: TCurrency }) => (
    <StatItem icon={Plus} iconClassName="text-income" label="Income" value={income} currency={currency} valueClassName="text-income" />
);

const WalletExpense = ({ expense, currency }: { expense: number; currency: TCurrency }) => (
    <StatItem icon={Minus} iconClassName="text-expense" label="Expenses" value={expense} currency={currency} valueClassName="text-expense" />
);

const WalletTransferIn = ({ amount, currency }: { amount: number; currency: TCurrency }) => (
    <StatItem icon={ArrowDownLeft} iconClassName="text-income" label="Transfer In" value={amount} currency={currency} />
);

const WalletTransferOut = ({ amount, currency }: { amount: number; currency: TCurrency }) => (
    <StatItem icon={ArrowUpRight} iconClassName="text-expense" label="Transfer Out" value={amount} currency={currency} />
);

const WalletNet = ({ net, currency }: { net: number; currency: TCurrency }) => (
    <StatItem
        icon={Equal}
        iconClassName={net >= 0 ? 'text-income' : 'text-expense'}
        label="Net"
        value={net}
        currency={currency}
        valueClassName={net >= 0 ? 'text-income' : 'text-expense'}
    />
);

export const WalletStats = ({ stats }: { stats: TStatWallet[] }) => {
    return (
        <div className="flex flex-col divide-y border">
            {stats.map(({ currency, income, expense, net, balance, transfers_in, transfers_out }) => {
                const hasTransfers = transfers_in > 0 || transfers_out > 0;

                return (
                    <div key={currency} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
                        <WalletBalance balance={balance} currency={currency} />

                        <Separator orientation="vertical" className="hidden h-8 sm:block" />

                        <div className="flex gap-6">
                            <WalletIncome income={income} currency={currency} />
                            <WalletExpense expense={expense} currency={currency} />
                        </div>

                        {hasTransfers && (
                            <>
                                <Separator orientation="vertical" className="hidden h-8 sm:block" />
                                <div className="flex gap-4">
                                    {transfers_in > 0 && <WalletTransferIn amount={transfers_in} currency={currency} />}
                                    {transfers_out > 0 && <WalletTransferOut amount={transfers_out} currency={currency} />}
                                </div>
                            </>
                        )}

                        <div className="ml-auto flex items-center gap-6">
                            <Separator orientation="vertical" className="hidden h-8 sm:block" />
                            <WalletNet net={net} currency={currency} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
