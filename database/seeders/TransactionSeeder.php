<?php

namespace Database\Seeders;

use App\Enums\Currency;
use App\Enums\Type;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\CarbonInterface;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            $bdtWallets = Wallet::where('user_id', $user->id)
                ->where('currency', Currency::BDT->value)
                ->get();

            $usdWallet = Wallet::where('user_id', $user->id)
                ->where('currency', Currency::USD->value)
                ->first();

            $cat = fn (string $name) => Category::where('user_id', $user->id)
                ->where('name', $name)->first();

            $salary     = $cat('Salary');
            $freelance  = $cat('Freelance');
            $investment = $cat('Investment');
            $food       = $cat('Food');
            $transport  = $cat('Transport');
            $shopping   = $cat('Shopping');
            $housing    = $cat('Housing');
            $health     = $cat('Health');
            $education  = $cat('Education');
            $entertain  = $cat('Entertainment');

            $bankWallet = $bdtWallets->firstWhere('name', 'Bank Account');
            $bkash      = $bdtWallets->firstWhere('name', 'bKash');
            $cash       = $bdtWallets->firstWhere('name', 'Cash');

            // Generate 6 months of history + current month
            for ($monthsAgo = 5; $monthsAgo >= 0; $monthsAgo--) {
                $month = now()->subMonths($monthsAgo);
                $isCurrentMonth = $monthsAgo === 0;

                // Monthly salary (1st of month)
                if ($salary && $bankWallet) {
                    $this->tx($user, $bankWallet, $salary, Type::Income, 55000, $month->copy()->startOfMonth()->addDay());
                }

                // Freelance (mid-month, not every month)
                if ($freelance && $usdWallet && fake()->boolean(70)) {
                    $this->tx($user, $usdWallet, $freelance, Type::Income, fake()->randomFloat(2, 200, 600), $month->copy()->day(15));
                }

                // Investment return (quarterly)
                if ($investment && $bankWallet && in_array($month->month, [1, 4, 7, 10])) {
                    $this->tx($user, $bankWallet, $investment, Type::Income, fake()->randomFloat(2, 5000, 15000), $month->copy()->day(10));
                }

                // Rent (2nd of month)
                if ($housing && $bkash) {
                    $this->tx($user, $bkash, $housing, Type::Expense, 18000, $month->copy()->startOfMonth()->addDays(2));
                }

                // Food: multiple times per month
                if ($food) {
                    $count = $isCurrentMonth ? fake()->numberBetween(12, 18) : fake()->numberBetween(15, 25);
                    for ($i = 0; $i < $count; $i++) {
                        $day = $isCurrentMonth
                            ? fake()->numberBetween(1, now()->day)
                            : fake()->numberBetween(1, 28);
                        $wallet = fake()->boolean(60) ? $bkash : $cash;
                        $this->tx($user, $wallet, $food, Type::Expense, fake()->randomFloat(2, 150, 800), $month->copy()->day($day));
                    }
                }

                // Transport
                if ($transport && $bkash) {
                    $count = $isCurrentMonth ? fake()->numberBetween(8, 14) : fake()->numberBetween(10, 20);
                    for ($i = 0; $i < $count; $i++) {
                        $day = $isCurrentMonth ? fake()->numberBetween(1, now()->day) : fake()->numberBetween(1, 28);
                        $this->tx($user, $bkash, $transport, Type::Expense, fake()->randomFloat(2, 50, 400), $month->copy()->day($day));
                    }
                }

                // Shopping (weekly-ish)
                if ($shopping) {
                    $count = $isCurrentMonth ? fake()->numberBetween(2, 4) : fake()->numberBetween(3, 6);
                    for ($i = 0; $i < $count; $i++) {
                        $day = $isCurrentMonth ? fake()->numberBetween(1, now()->day) : fake()->numberBetween(1, 28);
                        $wallet = fake()->boolean() ? $bkash : $bankWallet;
                        $this->tx($user, $wallet, $shopping, Type::Expense, fake()->randomFloat(2, 500, 4000), $month->copy()->day($day));
                    }
                }

                // Entertainment (a few times a month)
                if ($entertain && $bkash) {
                    $count = $isCurrentMonth ? fake()->numberBetween(2, 4) : fake()->numberBetween(2, 5);
                    for ($i = 0; $i < $count; $i++) {
                        $day = $isCurrentMonth ? fake()->numberBetween(1, now()->day) : fake()->numberBetween(1, 28);
                        $this->tx($user, $bkash, $entertain, Type::Expense, fake()->randomFloat(2, 200, 1200), $month->copy()->day($day));
                    }
                }

                // Health (occasional)
                if ($health && fake()->boolean(50)) {
                    $day = $isCurrentMonth ? fake()->numberBetween(1, now()->day) : fake()->numberBetween(1, 28);
                    $this->tx($user, $bkash ?? $cash, $health, Type::Expense, fake()->randomFloat(2, 300, 2500), $month->copy()->day($day));
                }

                // USD expenses (subscriptions + misc)
                if ($usdWallet && $entertain) {
                    $this->tx($user, $usdWallet, $entertain, Type::Expense, fake()->randomFloat(2, 15, 60), $month->copy()->day(5));
                }

                if ($usdWallet && $education) {
                    $this->tx($user, $usdWallet, $education, Type::Expense, fake()->randomFloat(2, 10, 50), $month->copy()->day(12));
                }
            }
        });
    }

    private function tx(User $user, Wallet $wallet, Category $category, Type $type, float $amount, CarbonInterface $date): void
    {
        Transaction::factory()->for($user)->for($wallet)->for($category)->create([
            'type' => $type->value,
            'amount' => $amount,
            'transacted_at' => $date->format('Y-m-d H:i:s'),
        ]);
    }
}
