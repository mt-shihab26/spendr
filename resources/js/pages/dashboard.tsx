import type {
    TGoal,
    TRecurringTransaction,
    TTransaction,
} from '@/types/models';
import type { TSpendingCategory } from '@/components/screens/dashboard/top-spending-by-category';
import type { TCurrencyStat } from '@/components/screens/dashboard/currency-stats';
import type { TDashboardWallet } from '@/components/screens/dashboard/top-wallets';
import type { TBudgetStatus } from '@/components/screens/dashboard/budget-status';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { NewButton } from '@/components/elements/new-button';
import { ViewAllLink } from '@/components/elements/view-all-link';
import { CurrencyStats } from '@/components/screens/dashboard/currency-stats';
import { TopWallets } from '@/components/screens/dashboard/top-wallets';
import { TopSpendingByCategory } from '@/components/screens/dashboard/top-spending-by-category';
import { RecentTransactions } from '@/components/screens/dashboard/recent-transactions';
import { BudgetStatus } from '@/components/screens/dashboard/budget-status';
import { Goals } from '@/components/screens/dashboard/goals';
import { UpcomingRecurring } from '@/components/screens/dashboard/upcoming-recurring';

const Dashboard = ({
    currencyStats,
    wallets,
    spendingCategories,
    recentTransactions,
    budgets,
    upcomingRecurring,
    goals,
}: {
    currencyStats: TCurrencyStat[];
    wallets: TDashboardWallet[];
    spendingCategories: TSpendingCategory[];
    recentTransactions: TTransaction[];
    budgets: TBudgetStatus[];
    upcomingRecurring: TRecurringTransaction[];
    goals: TGoal[];
}) => {
    return (
        <AppLayout
            title="Dashboard"
            description="Overview of your account"
            breadcrumbs={[{ title: 'Dashboard', route: 'dashboard' }]}
        >
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="Dashboard"
                        description="Overview of your account"
                    />
                    <NewButton href={route('transactions.create')}>
                        Add Transaction
                    </NewButton>
                </div>
                <CurrencyStats currencyStats={currencyStats} />
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-4">
                        <TopWallets wallets={wallets} />
                        <TopSpendingByCategory
                            spendingCategories={spendingCategories}
                        />
                    </div>
                    <div className="flex justify-end">
                        <ViewAllLink href={route('reports.index')}>
                            View Full Report
                        </ViewAllLink>
                    </div>
                </div>
                <RecentTransactions recentTransactions={recentTransactions} />
                <BudgetStatus budgets={budgets} />
                <div className="flex gap-4">
                    <Goals goals={goals} />
                    <UpcomingRecurring upcomingRecurring={upcomingRecurring} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
