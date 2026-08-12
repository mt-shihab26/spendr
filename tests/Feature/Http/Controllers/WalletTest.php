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
    it('guests are redirected to the login page', function () {
        $this->get(route('wallets.index'))
            ->assertRedirect(route('login'));
    });

    it('authenticated users can visit the wallets page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('wallets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('wallets/index'));
    });

    it('returns empty stats and wallets when user has no wallets', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('wallets.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallets', [])
                ->where('stats', [])
            );
    });

    describe('stats', function () {
        it('returns one entry per unique currency', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value]);
            Wallet::factory()->for($user)->create(['currency' => Currency::USD->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('stats', 2)
                );
        });

        it('groups wallets from the same currency into one entry', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->count(3)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('stats', 1)
                );
        });

        it('includes all expected fields', function () {
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

        it('balance reflects initial balance plus income minus expense', function () {
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

        it('initial_balance is summed across wallets in the same currency', function () {
            $user = User::factory()->create();
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 300]);
            Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 700]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('stats.0.initial_balance', 1000)
                );
        });

        it('transfers_in and transfers_out are summed from wallet transfers', function () {
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
        it('only shows wallets belonging to the authenticated user', function () {
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

        it('is limited to the configured wallet limit', function () {
            $user = User::factory()->create();
            $limit = config('limits.wallets');
            Wallet::factory()->for($user)->count($limit + 5)->create(['currency' => Currency::BDT->value]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->has('wallets', $limit)
                );
        });

        it('each wallet includes transactions_count', function () {
            $user = User::factory()->create();
            $wallet = Wallet::factory()->for($user)->create();
            $category = Category::factory()->for($user)->expense()->create();

            Transaction::factory()->count(3)->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'category_id' => $category->id,
                'type' => Type::Expense->value,
            ]);

            $this->actingAs($user)
                ->get(route('wallets.index'))
                ->assertInertia(fn (Assert $page) => $page
                    ->where('wallets.0.transactions_count', 3)
                );
        });
    });
});

describe('create', function () {
    it('guests are redirected to the login page', function () {
        $this->get(route('wallets.create'))
            ->assertRedirect(route('login'));
    });

    it('authenticated users can visit the create wallet page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('wallets.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('wallets/create'));
    });
});

describe('store', function () {
    it('guests are redirected to the login page', function () {
        $this->post(route('wallets.store'), [])
            ->assertRedirect(route('login'));
    });

    it('creates a wallet and redirects to the show page with a success message', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'currency' => Currency::BDT->value,
                'initial_balance' => 1000,
                'color' => '#ff0000',
                'is_default' => false,
            ])
            ->assertRedirect(route('wallets.show', $user->wallets()->first()))
            ->assertSessionHas('success', 'Wallet created.');
    });

    it('stores the wallet in the database', function () {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('wallets.store'), [
            'name' => 'Savings',
            'currency' => Currency::USD->value,
            'initial_balance' => 500,
            'color' => '#00ff00',
            'is_default' => false,
        ]);

        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'name' => 'Savings',
            'currency' => Currency::USD->value,
            'initial_balance' => 500,
        ]);
    });

    it('when is_default is true, clears default from all other wallets', function () {
        $user = User::factory()->create();
        $existing = Wallet::factory()->for($user)->default()->create();

        $this->actingAs($user)->post(route('wallets.store'), [
            'name' => 'New Default',
            'currency' => Currency::BDT->value,
            'color' => '#000000',
            'is_default' => true,
        ]);

        expect($existing->fresh()->is_default)->toBeFalse();
        expect($user->wallets()->where('name', 'New Default')->first()->is_default)->toBeTrue();
    });

    it('when is_default is false, other wallets keep their default status', function () {
        $user = User::factory()->create();
        $existing = Wallet::factory()->for($user)->default()->create();

        $this->actingAs($user)->post(route('wallets.store'), [
            'name' => 'Secondary',
            'currency' => Currency::BDT->value,
            'color' => '#000000',
            'is_default' => false,
        ]);

        expect($existing->fresh()->is_default)->toBeTrue();
    });

    it('returns 403 when the wallet limit is reached', function () {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->count(config('limits.wallets'))->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'Extra Wallet',
                'currency' => Currency::BDT->value,
                'color' => '#000000',
                'is_default' => false,
            ])
            ->assertForbidden();
    });

    it('name is required', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'currency' => Currency::BDT->value,
                'color' => '#000000',
            ])
            ->assertSessionHasErrors('name');
    });

    it('name must not exceed 100 characters', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => str_repeat('a', 101),
                'currency' => Currency::BDT->value,
                'color' => '#000000',
            ])
            ->assertSessionHasErrors('name');
    });

    it('name must be unique per user', function () {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['name' => 'Savings']);

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'Savings',
                'currency' => Currency::BDT->value,
                'color' => '#000000',
            ])
            ->assertSessionHasErrors('name');
    });

    it('name can be reused by a different user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Wallet::factory()->for($other)->create(['name' => 'Savings']);

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'Savings',
                'currency' => Currency::BDT->value,
                'color' => '#000000',
                'is_default' => false,
            ])
            ->assertSessionHasNoErrors();
    });

    it('currency is required', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'color' => '#000000',
            ])
            ->assertSessionHasErrors('currency');
    });

    it('currency must be a valid enum value', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'currency' => 'INVALID',
                'color' => '#000000',
            ])
            ->assertSessionHasErrors('currency');
    });

    it('color is required', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'currency' => Currency::BDT->value,
            ])
            ->assertSessionHasErrors('color');
    });

    it('initial_balance is optional', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'currency' => Currency::BDT->value,
                'color' => '#000000',
                'is_default' => false,
            ])
            ->assertSessionHasNoErrors();
    });

    it('initial_balance must not be negative', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('wallets.store'), [
                'name' => 'My Wallet',
                'currency' => Currency::BDT->value,
                'color' => '#000000',
                'initial_balance' => -100,
            ])
            ->assertSessionHasErrors('initial_balance');
    });
});

describe('show', function () {
    it('guests are redirected to the login page', function () {
        $wallet = Wallet::factory()->for(User::factory()->create())->create();

        $this->get(route('wallets.show', $wallet))
            ->assertRedirect(route('login'));
    });

    it('authenticated users can visit the wallet show page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->get(route('wallets.show', $wallet))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('wallets/show'));
    });

    it('returns 403 when the wallet belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('wallets.show', $wallet))
            ->assertForbidden();
    });

    it('includes all expected wallet fields', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->get(route('wallets.show', $wallet))
            ->assertInertia(fn (Assert $page) => $page
                ->has('wallet', fn (Assert $w) => $w
                    ->has('balance')
                    ->has('income')
                    ->has('expense')
                    ->has('transfers_in')
                    ->has('transfers_out')
                    ->has('net')
                    ->has('transactions_count')
                    ->etc()
                )
            );
    });

    it('transactions_count reflects the number of transactions', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $category = Category::factory()->for($user)->expense()->create();

        Transaction::factory()->count(4)->create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'category_id' => $category->id,
            'type' => Type::Expense->value,
        ]);

        $this->actingAs($user)
            ->get(route('wallets.show', $wallet))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.transactions_count', 4)
            );
    });

    it('balance reflects initial balance plus income minus expense', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create(['initial_balance' => 1000]);
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
            ->get(route('wallets.show', $wallet))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.income', 500)
                ->where('wallet.expense', 200)
                ->where('wallet.balance', 1300)
            );
    });

    it('transfers_in and transfers_out are summed from wallet transfers', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 0]);
        $walletB = Wallet::factory()->for($user)->create(['currency' => Currency::BDT->value, 'initial_balance' => 0]);

        Transfer::factory()->create([
            'user_id' => $user->id,
            'from_wallet_id' => $walletA->id,
            'to_wallet_id' => $walletB->id,
            'amount' => 300,
        ]);

        $this->actingAs($user)
            ->get(route('wallets.show', $walletA))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.transfers_out', 300)
                ->where('wallet.transfers_in', 0)
            );

        $this->actingAs($user)
            ->get(route('wallets.show', $walletB))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.transfers_in', 300)
                ->where('wallet.transfers_out', 0)
            );
    });

    it('net is income minus expense plus transfers_in minus transfers_out', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create(['initial_balance' => 0]);
        $walletB = Wallet::factory()->for($user)->create(['initial_balance' => 0]);
        $income = Category::factory()->for($user)->income()->create();
        $expense = Category::factory()->for($user)->expense()->create();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'category_id' => $income->id,
            'type' => Type::Income->value,
            'amount' => 600,
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'wallet_id' => $walletA->id,
            'category_id' => $expense->id,
            'type' => Type::Expense->value,
            'amount' => 100,
        ]);

        Transfer::factory()->create([
            'user_id' => $user->id,
            'from_wallet_id' => $walletA->id,
            'to_wallet_id' => $walletB->id,
            'amount' => 200,
        ]);

        $this->actingAs($user)
            ->get(route('wallets.show', $walletA))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.net', 300) // 600 - 100 - 200
            );
    });
});

describe('edit', function () {
    it('guests are redirected to the login page', function () {
        $wallet = Wallet::factory()->for(User::factory()->create())->create();

        $this->get(route('wallets.edit', $wallet))
            ->assertRedirect(route('login'));
    });

    it('authenticated users can visit the edit wallet page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->get(route('wallets.edit', $wallet))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('wallets/edit'));
    });

    it('returns 403 when the wallet belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('wallets.edit', $wallet))
            ->assertForbidden();
    });

    it('has_transactions is false when wallet has no transactions', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->get(route('wallets.edit', $wallet))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.has_transactions', false)
            );
    });

    it('has_transactions is true when wallet has transactions', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $category = Category::factory()->for($user)->expense()->create();

        Transaction::factory()->create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'category_id' => $category->id,
            'type' => Type::Expense->value,
        ]);

        $this->actingAs($user)
            ->get(route('wallets.edit', $wallet))
            ->assertInertia(fn (Assert $page) => $page
                ->where('wallet.has_transactions', true)
            );
    });
});

describe('update', function () {
    it('guests are redirected to the login page', function () {
        $wallet = Wallet::factory()->for(User::factory()->create())->create();

        $this->patch(route('wallets.update', $wallet), [])
            ->assertRedirect(route('login'));
    });

    it('returns 403 when the wallet belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['name' => 'New Name'])
            ->assertForbidden();
    });

    it('updates the wallet and redirects back with a success message', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create(['name' => 'Old Name']);

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['name' => 'New Name'])
            ->assertRedirect()
            ->assertSessionHas('success', 'Wallet updated.');

        expect($wallet->fresh()->name)->toBe('New Name');
    });

    it('when is_default is true, clears default from all other wallets', function () {
        $user = User::factory()->create();
        $other = Wallet::factory()->for($user)->default()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['is_default' => true]);

        expect($other->fresh()->is_default)->toBeFalse();
        expect($wallet->fresh()->is_default)->toBeTrue();
    });

    it('when is_default is true, does not clear default from itself', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->default()->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['is_default' => true]);

        expect($wallet->fresh()->is_default)->toBeTrue();
    });

    it('when is_default is false, other wallets keep their default status', function () {
        $user = User::factory()->create();
        $default = Wallet::factory()->for($user)->default()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['is_default' => false]);

        expect($default->fresh()->is_default)->toBeTrue();
    });

    it('name must be unique per user ignoring the wallet itself', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create(['name' => 'Savings']);

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['name' => 'Savings'])
            ->assertSessionHasNoErrors();
    });

    it('name must not duplicate another wallet name for the same user', function () {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['name' => 'Savings']);
        $wallet = Wallet::factory()->for($user)->create(['name' => 'Other']);

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['name' => 'Savings'])
            ->assertSessionHasErrors('name');
    });

    it('name must not exceed 100 characters', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['name' => str_repeat('a', 101)])
            ->assertSessionHasErrors('name');
    });

    it('currency must be a valid enum value', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['currency' => 'INVALID'])
            ->assertSessionHasErrors('currency');
    });

    it('initial_balance must not be negative', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->patch(route('wallets.update', $wallet), ['initial_balance' => -50])
            ->assertSessionHasErrors('initial_balance');
    });
});

describe('destroy', function () {
    it('guests are redirected to the login page', function () {
        $wallet = Wallet::factory()->for(User::factory()->create())->create();

        $this->delete(route('wallets.destroy', $wallet))
            ->assertRedirect(route('login'));
    });

    it('returns 403 when the wallet belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $wallet))
            ->assertForbidden();
    });

    it('deletes the wallet and redirects to the index with a success message', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $wallet))
            ->assertRedirect(route('wallets.index'))
            ->assertSessionHas('success', 'Wallet deleted.');

        $this->assertSoftDeleted('wallets', ['id' => $wallet->id]);
    });

    it('when the deleted wallet was default, promotes the next wallet to default', function () {
        $user = User::factory()->create();
        $default = Wallet::factory()->for($user)->default()->create(['sort_order' => 1]);
        $next = Wallet::factory()->for($user)->create(['sort_order' => 2]);

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $default));

        expect($next->fresh()->is_default)->toBeTrue();
    });

    it('promotes the wallet with the lowest sort_order first', function () {
        $user = User::factory()->create();
        $default = Wallet::factory()->for($user)->default()->create(['sort_order' => 1]);
        $second = Wallet::factory()->for($user)->create(['sort_order' => 3]);
        $first = Wallet::factory()->for($user)->create(['sort_order' => 2]);

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $default));

        expect($first->fresh()->is_default)->toBeTrue();
        expect($second->fresh()->is_default)->toBeFalse();
    });

    it('when the deleted wallet was not default, no other wallet is promoted', function () {
        $user = User::factory()->create();
        $default = Wallet::factory()->for($user)->default()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $wallet));

        expect($default->fresh()->is_default)->toBeTrue();
    });

    it('when no other wallets exist after deleting the default, nothing breaks', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->default()->create();

        $this->actingAs($user)
            ->delete(route('wallets.destroy', $wallet))
            ->assertRedirect(route('wallets.index'));

        expect($user->wallets()->count())->toBe(0);
    });
});
