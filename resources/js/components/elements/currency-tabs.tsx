import type { TCurrency } from '@/types/enums';

import { router } from '@inertiajs/react';
import { getCurrencySymbol } from '@/lib/currency';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CurrencyTabs = ({
    href,
    currency = 'BDT',
    currencies,
}: {
    href: string;
    currency: TCurrency;
    currencies: TCurrency[];
}) => {
    const switchCurrency = (c: string) => {
        router.get(
            href,
            Object.fromEntries(
                Object.entries({ currency: c }).filter(
                    ([, v]) => v !== null && v !== undefined,
                ),
            ),
            {
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <Tabs value={currency} onValueChange={switchCurrency}>
            <TabsList variant="line">
                {currencies.map((c) => (
                    <TabsTrigger
                        className="cursor-pointer text-lg"
                        key={c}
                        value={c}
                    >
                        {getCurrencySymbol(c)} {c}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};
