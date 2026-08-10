<?php

use App\Enums\Currency;
use App\Enums\Type;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Inertia\Testing\AssertableInertia as Assert;

describe('index', function () {
    test('guests are redirected to the login page', function () {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    });

    test('authenticated users can visit the dashboard', function () {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    });

    describe('currencyStats', function () {
        test('is empty when user has no wallets', function () {
            $user = User::factory()->create();

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('currencyStats', [])
                );
        });

        test('returns one entry per unique currency', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value]);
            Wallet::factory()->for($user)->create(['currency' => Currency::USD->value]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('currencyStats', 2)
                );
        });

        test('balance reflects initial balance plus all-time income minus expense', function () {
            $user = User::factory()->create();
            $wallet = Wallet::factory()->for($user)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 1000,
            ]);
            $income = Category::factory()->for($user)->income()->create();
            $expense = Category::factory()->for($user)->expense()->create();

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 500,
                'transacted_at' => now()->subYear()->startOfMonth(),
            ]);

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $expense->id,
                'type' => Type::Expense->value,
                'amount' => 200,
                'transacted_at' => now()->subYear()->startOfMonth(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('currencyStats.0.balance', 1300)
                );
        });

        test('month_income and month_expense are scoped to the current month', function () {
            $user = User::factory()->create();
            $wallet = Wallet::factory()->for($user)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 0,
            ]);
            $income = Category::factory()->for($user)->income()->create();
            $expense = Category::factory()->for($user)->expense()->create();

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 500,
                'transacted_at' => now()->startOfMonth(),
            ]);

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $expense->id,
                'type' => Type::Expense->value,
                'amount' => 200,
                'transacted_at' => now()->startOfMonth(),
            ]);

            // Previous month — must not bleed into current month stats
            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 9999,
                'transacted_at' => now()->subMonth()->startOfMonth(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('currencyStats.0.month_income', 500)
                    ->where('currencyStats.0.month_expense', 200)
                    ->where('currencyStats.0.net_worth_delta', 300)
                );
        });

        test('prev_month_income and prev_month_expense are scoped to the previous month', function () {
            $user = User::factory()->create();
            $wallet = Wallet::factory()->for($user)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 0,
            ]);
            $income = Category::factory()->for($user)->income()->create();
            $expense = Category::factory()->for($user)->expense()->create();

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 800,
                'transacted_at' => now()->subMonth()->startOfMonth(),
            ]);

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $expense->id,
                'type' => Type::Expense->value,
                'amount' => 300,
                'transacted_at' => now()->subMonth()->startOfMonth(),
            ]);

            // Current month — must not bleed into previous month stats
            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 9999,
                'transacted_at' => now()->startOfMonth(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('currencyStats.0.prev_month_income', 800)
                    ->where('currencyStats.0.prev_month_expense', 300)
                );
        });

        test('excludes transactions belonging to other users', function () {
            $user = User::factory()->create();
            $other = User::factory()->create();

            Wallet::factory()->for($user)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 0,
            ]);

            $otherWallet = Wallet::factory()->for($other)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 0,
            ]);

            $otherIncome = Category::factory()->for($other)->income()->create();

            Transaction::factory()->create([
                'user_id' => $other->id,
                'wallet_id' => $otherWallet->id,
                'category_id' => $otherIncome->id,
                'type' => Type::Income->value,
                'amount' => 9999,
                'transacted_at' => now()->startOfMonth(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('currencyStats.0.month_income', 0)
                    ->where('currencyStats.0.balance', 0)
                );
        });

        test('stats are separated per currency with no cross-contamination', function () {
            $user = User::factory()->create();

            $bdtWallet = Wallet::factory()->for($user)->create([
                'currency' => Currency::BDT->value,
                'initial_balance' => 0,
            ]);

            $usdWallet = Wallet::factory()->for($user)->create([
                'currency' => Currency::USD->value,
                'initial_balance' => 0,
            ]);

            $income = Category::factory()->for($user)->income()->create();

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $bdtWallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 200,
                'transacted_at' => now()->startOfMonth(),
            ]);

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $usdWallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 100,
                'transacted_at' => now()->startOfMonth(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('currencyStats', 2)
                    ->where('currencyStats.0.currency', 'BDT')
                    ->where('currencyStats.0.month_income', 200)
                    ->where('currencyStats.0.month_expense', 0)
                    ->where('currencyStats.1.currency', 'USD')
                    ->where('currencyStats.1.month_income', 100)
                    ->where('currencyStats.1.month_expense', 0)
                );
        });
    });

    describe('computeTopWallets', function () {
        test('is empty when user has no wallets', function () {
            $user = User::factory()->create();

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('wallets', [])
                );
        });

        test('returns at most 5 wallets', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->count(7)->create();

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', 5)
                );
        });

        test('returns all wallets when fewer than 5 exist', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->count(3)->create();

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', 3)
                );
        });

        test('excludes wallets belonging to other users', function () {
            $user = User::factory()->create();
            $other = User::factory()->create();

            Wallet::factory()->for($user)->create();
            Wallet::factory()->for($other)->count(3)->create();

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', 1)
                );
        });

        test('wallets are ordered by sort_order then created_at', function () {
            $user = User::factory()->create();

            $third = Wallet::factory()->for($user)->create(['name' => 'Third', 'sort_order' => 3]);
            $first = Wallet::factory()->for($user)->create(['name' => 'First', 'sort_order' => 1]);
            $second = Wallet::factory()->for($user)->create(['name' => 'Second', 'sort_order' => 2]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('wallets.0.name', 'First')
                    ->where('wallets.1.name', 'Second')
                    ->where('wallets.2.name', 'Third')
                );
        });

        test('each wallet includes a computed balance', function () {
            $user = User::factory()->create();
            $wallet = Wallet::factory()->for($user)->create(['initial_balance' => 500]);

            $income = Category::factory()->for($user)->income()->create();

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $income->id,
                'type' => Type::Income->value,
                'amount' => 300,
                'transacted_at' => now(),
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('wallets.0.balance', 800)
                );
        });
    });
});
