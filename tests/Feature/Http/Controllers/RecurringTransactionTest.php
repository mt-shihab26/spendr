<?php

use App\Models\Category;
use App\Models\RecurringTransaction;
use App\Models\User;
use App\Models\Wallet;
use Inertia\Testing\AssertableInertia as Assert;

$validPayload = [
    'type' => 'expense',
    'amount' => 500,
    'name' => 'Monthly Rent',
    'frequency' => 'monthly',
    'next_due_at' => '2025-09-01',
];

describe('index', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('recurring-transactions.index'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the recurring transactions page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('recurring-transactions.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('recurring-transactions/index'));
    });

    test('returns only the authenticated users recurring transactions', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();

        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);
        RecurringTransaction::factory()->create(['user_id' => $other->id, 'wallet_id' => $otherWallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.index'))
            ->assertInertia(fn (Assert $page) => $page->has('recurring', 1));
    });

    test('filters recurring transactions by is_active', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'is_active' => true]);
        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'is_active' => false]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.index', ['is_active' => 1]))
            ->assertInertia(fn (Assert $page) => $page->has('recurring', 1));
    });

    test('includes stats grouped by currency', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create(['currency' => 'USD']);

        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'amount' => 100, 'is_active' => true]);
        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'amount' => 200, 'is_active' => false]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('stats', 1)
                ->where('stats.0.currency', 'USD')
                ->where('stats.0.total', 2)
                ->where('stats.0.active', 1)
                ->where('stats.0.amount', 300)
            );
    });

    test('stats respect the is_active filter', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create(['currency' => 'USD']);

        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'amount' => 100, 'is_active' => true]);
        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'amount' => 200, 'is_active' => false]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.index', ['is_active' => 1]))
            ->assertInertia(fn (Assert $page) => $page
                ->where('stats.0.total', 1)
                ->where('stats.0.amount', 100)
            );
    });
});

describe('create', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('recurring-transactions.create'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the create page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('recurring-transactions.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('recurring-transactions/create'));
    });

    test('includes wallets belonging to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Wallet::factory()->for($user)->create();
        Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('recurring-transactions.create'))
            ->assertInertia(fn (Assert $page) => $page->has('wallets', 1));
    });

    test('includes categories belonging to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Category::factory()->for($user)->create();
        Category::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('recurring-transactions.create'))
            ->assertInertia(fn (Assert $page) => $page->has('categories', 1));
    });
});

describe('store', function () use (&$validPayload) {
    test('guests are redirected to the login page', function () {
        $this->post(route('recurring-transactions.store'), [])
            ->assertRedirect(route('login'));
    });

    test('creates a recurring transaction and redirects to show with a success message', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id]))
            ->assertRedirect()
            ->assertSessionHas('success', 'Recurring transaction created.');
    });

    test('stores the recurring transaction in the database', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id]));

        $this->assertDatabaseHas('recurring_transactions', [
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'name' => 'Monthly Rent',
            'amount' => 500,
            'frequency' => 'monthly',
        ]);
    });

    test('is_active defaults to true when not provided', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id]));

        $this->assertDatabaseHas('recurring_transactions', [
            'user_id' => $user->id,
            'is_active' => true,
        ]);
    });

    test('returns 403 when the recurring transaction limit is reached', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        config(['limits.recurring_transactions' => 1]);
        RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id]))
            ->assertForbidden();
    });

    test('wallet_id is required', function () use (&$validPayload) {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), $validPayload)
            ->assertSessionHasErrors('wallet_id');
    });

    test('wallet_id must belong to the authenticated user', function () use (&$validPayload) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $otherWallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $otherWallet->id]))
            ->assertSessionHasErrors('wallet_id');
    });

    test('name is required', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'name' => '']))
            ->assertSessionHasErrors('name');
    });

    test('type is required', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'type' => '']))
            ->assertSessionHasErrors('type');
    });

    test('type must be a valid value', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'type' => 'invalid']))
            ->assertSessionHasErrors('type');
    });

    test('amount is required', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'amount' => '']))
            ->assertSessionHasErrors('amount');
    });

    test('amount must be at least 0.01', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'amount' => 0]))
            ->assertSessionHasErrors('amount');
    });

    test('frequency is required', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'frequency' => '']))
            ->assertSessionHasErrors('frequency');
    });

    test('frequency must be a valid value', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'frequency' => 'biweekly']))
            ->assertSessionHasErrors('frequency');
    });

    test('next_due_at is required', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'next_due_at' => '']))
            ->assertSessionHasErrors('next_due_at');
    });

    test('next_due_at must be a valid date', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'next_due_at' => 'not-a-date']))
            ->assertSessionHasErrors('next_due_at');
    });

    test('category_id must belong to the authenticated user', function () use (&$validPayload) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $otherCategory = Category::factory()->for($other)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id, 'category_id' => $otherCategory->id]))
            ->assertSessionHasErrors('category_id');
    });

    test('notes is optional', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('recurring-transactions.store'), array_merge($validPayload, ['wallet_id' => $wallet->id]))
            ->assertSessionHasNoErrors();
    });
});

describe('show', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->get(route('recurring-transactions.show', $recurring))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the show page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.show', $recurring))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('recurring-transactions/show'));
    });

    test('returns 403 when the recurring transaction belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $other->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.show', $recurring))
            ->assertForbidden();
    });

    test('includes wallet and category relations', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $category = Category::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'category_id' => $category->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.show', $recurring))
            ->assertInertia(fn (Assert $page) => $page
                ->has('recurring.wallet')
                ->has('recurring.category')
            );
    });
});

describe('edit', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->get(route('recurring-transactions.edit', $recurring))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the edit page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.edit', $recurring))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('recurring-transactions/edit'));
    });

    test('returns 403 when the recurring transaction belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $other->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.edit', $recurring))
            ->assertForbidden();
    });

    test('includes wallets, categories, and the recurring transaction with relations', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        Wallet::factory()->for($other)->create();
        Category::factory()->for($user)->create();
        Category::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->get(route('recurring-transactions.edit', $recurring))
            ->assertInertia(fn (Assert $page) => $page
                ->has('wallets', 1)
                ->has('categories', 1)
                ->has('recurring.wallet')
            );
    });
});

describe('update', function () use (&$validPayload) {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->patch(route('recurring-transactions.update', $recurring), [])
            ->assertRedirect(route('login'));
    });

    test('returns 403 when the recurring transaction belongs to another user', function () use (&$validPayload) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $userWallet = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $other->id, 'wallet_id' => $otherWallet->id]);

        $this->actingAs($user)
            ->patch(route('recurring-transactions.update', $recurring), array_merge($validPayload, ['wallet_id' => $userWallet->id]))
            ->assertForbidden();
    });

    test('updates the recurring transaction and redirects back with a success message', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id, 'name' => 'Old Name']);

        $this->actingAs($user)
            ->patch(route('recurring-transactions.update', $recurring), array_merge($validPayload, ['wallet_id' => $wallet->id, 'name' => 'New Name']))
            ->assertRedirect()
            ->assertSessionHas('success', 'Recurring transaction updated.');

        expect($recurring->fresh()->name)->toBe('New Name');
    });

    test('amount must be at least 0.01', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->patch(route('recurring-transactions.update', $recurring), array_merge($validPayload, ['wallet_id' => $wallet->id, 'amount' => 0]))
            ->assertSessionHasErrors('amount');
    });

    test('wallet_id must belong to the authenticated user', function () use (&$validPayload) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->patch(route('recurring-transactions.update', $recurring), array_merge($validPayload, ['wallet_id' => $otherWallet->id]))
            ->assertSessionHasErrors('wallet_id');
    });

    test('frequency must be a valid value', function () use (&$validPayload) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->patch(route('recurring-transactions.update', $recurring), array_merge($validPayload, ['wallet_id' => $wallet->id, 'frequency' => 'biweekly']))
            ->assertSessionHasErrors('frequency');
    });
});

describe('destroy', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->delete(route('recurring-transactions.destroy', $recurring))
            ->assertRedirect(route('login'));
    });

    test('returns 403 when the recurring transaction belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($other)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $other->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->delete(route('recurring-transactions.destroy', $recurring))
            ->assertForbidden();
    });

    test('soft deletes the recurring transaction and redirects to index with a success message', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $recurring = RecurringTransaction::factory()->create(['user_id' => $user->id, 'wallet_id' => $wallet->id]);

        $this->actingAs($user)
            ->delete(route('recurring-transactions.destroy', $recurring))
            ->assertRedirect(route('recurring-transactions.index'))
            ->assertSessionHas('success', 'Recurring transaction deleted.');

        $this->assertSoftDeleted('recurring_transactions', ['id' => $recurring->id]);
    });
});
