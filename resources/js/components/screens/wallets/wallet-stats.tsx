import type { TCurrency } from '@/types/enums';

import { Separator } from '@/components/ui/separator';
import { Balance } from '@/components/elements/balance';
import { Income } from '@/components/elements/income';
import { Expense } from '@/components/elements/expense';
import { TransferIn } from '@/components/elements/transfer-in';
import { TransferOut } from '@/components/elements/transfer-out';
import { Net } from '@/components/elements/net';

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

export const WalletStats = ({ stats }: { stats: TStatWallet[] }) => {
    return (
        <div className="flex flex-col divide-y border">
            {stats.map(({ currency, income, expense, net, balance, transfers_in, transfers_out }) => {
                const hasTransfers = transfers_in > 0 || transfers_out > 0;

                return (
                    <div key={currency} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
                        <Balance balance={balance} currency={currency} />

                        <Separator orientation="vertical" className="hidden h-8 sm:block" />

                        <div className="flex gap-6">
                            <Income income={income} currency={currency} />
                            <Expense expense={expense} currency={currency} />
                        </div>

                        {hasTransfers && (
                            <>
                                <Separator orientation="vertical" className="hidden h-8 sm:block" />
                                <div className="flex gap-4">
                                    {transfers_in > 0 && <TransferIn amount={transfers_in} currency={currency} />}
                                    {transfers_out > 0 && <TransferOut amount={transfers_out} currency={currency} />}
                                </div>
                            </>
                        )}

                        <div className="ml-auto flex items-center gap-6">
                            <Separator orientation="vertical" className="hidden h-8 sm:block" />
                            <Net net={net} currency={currency} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
