<?php

use App\Enums\Currency;
use App\Enums\Type;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Inertia\Testing\AssertableInertia as Assert;

describe('index', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('wallets.index'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the wallets page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('wallets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('wallets/index'));
    });

    test('returns empty stats and wallets when user has no wallets', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('wallets.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallets', [])
                ->where('stats', [])
            );
    });

    describe('stats', function () {
        test('returns one entry per unique currency', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value]);
            Wallet::factory()->for($user)->create(['currency' => Currency::USD->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('stats', 2)
                );
        });

        test('groups wallets from the same currency into one entry', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->count(3)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('stats', 1)
                );
        });

        test('includes all expected fields', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('stats.0', fn (Assert $stat) => $stat
                        ->has('currency')
                        ->has('initial_balance')
                        ->has('income')
                        ->has('expense')
                        ->has('transfers_out')
                        ->has('transfers_in')
                        ->has('net')
                        ->has('balance')
                    )
                );
        });

        test('balance reflects initial balance plus income minus expense', function () {
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
            ]);

            Transaction::factory()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $expense->id,
                'type' => Type::Expense->value,
                'amount' => 200,
            ]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('stats.0.income', 500)
                    ->where('stats.0.expense', 200)
                    ->where('stats.0.balance', 1300)
                );
        });

        test('initial_balance is summed across wallets in the same currency', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 300]);
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 700]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('stats.0.initial_balance', 1000)
                );
        });

        test('transfers_in and transfers_out are summed from wallet transfers', function () {
            $user = User::factory()->create();
            $walletA = Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 0]);
            $walletB = Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 0]);

            Transfer::factory()->create([
                'user_id' => $user->id,
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 100,
            ]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('stats.0.transfers_out', 100)
                    ->where('stats.0.transfers_in', 100)
                );
        });
    });

    describe('wallets', function () {
        test('only shows wallets belonging to the authenticated user', function () {
            $user = User::factory()->create();
            $other = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value]);
            Wallet::factory()->for($other)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', 1)
                );
        });

        test('is limited to the configured wallet limit', function () {
            $user = User::factory()->create();
            $limit = config('limits.wallets');
            Wallet::factory()->for($user)->count($limit + 5)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', $limit)
                );
        });
    });
});
