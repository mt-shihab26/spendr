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
            {stats.map(
                ({
                    currency,
                    income,
                    expense,
                    net,
                    balance,
                    transfers_in,
                    transfers_out,
                }) => {
                    const hasTransfers = transfers_in > 0 || transfers_out > 0;
                    return (
                        <div
                            key={currency}
                            className="flex items-center px-4 py-3"
                        >
                            <div className="flex w-[20%] shrink-0 justify-start">
                                <Balance
                                    balance={balance}
                                    currency={currency}
                                />
                            </div>
                            <Separator
                                orientation="vertical"
                                className="hidden h-8 sm:block"
                            />
                            <div className="flex w-[35%] shrink-0 justify-start px-4">
                                <div className="w-2/5">
                                    <Income
                                        income={income}
                                        currency={currency}
                                    />
                                </div>
                                <div className="w-3/5">
                                    <Expense
                                        expense={expense}
                                        currency={currency}
                                    />
                                </div>
                            </div>
                            {false && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="hidden h-8 sm:block"
                                    />
                                    <div className="flex w-[35%] shrink-0 justify-start px-4">
                                        <div className="w-2/5">
                                            {transfers_in > 0 && (
                                                <TransferIn
                                                    amount={transfers_in}
                                                    currency={currency}
                                                />
                                            )}
                                        </div>
                                        <div className="w-3/5">
                                            {transfers_out > 0 && (
                                                <TransferOut
                                                    amount={transfers_out}
                                                    currency={currency}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <Separator
                                orientation="vertical"
                                className="hidden h-8 sm:block"
                            />
                            <div className="flex w-[10%] shrink-0 justify-start px-4">
                                <Net net={net} currency={currency} />
                            </div>
                        </div>
                    );
                },
            )}
        </div>
    );
};
