<?php

use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Inertia\Testing\AssertableInertia as Assert;

$validTransactedAt = '2024-01-15T10:30:00.000Z';

describe('index', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('transfers.index'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the transfers page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('transfers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('transfers/index'));
    });

    test('returns only the authenticated users transfers', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $otherWalletA = Wallet::factory()->for($other)->create();
        $otherWalletB = Wallet::factory()->for($other)->create();

        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);
        Transfer::factory()->create(['user_id' => $other->id, 'from_wallet_id' => $otherWalletA->id, 'to_wallet_id' => $otherWalletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.index'))
            ->assertInertia(fn (Assert $page) => $page->has('transfers.data', 1));
    });

    test('returns wallets belonging to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Wallet::factory()->for($user)->create();
        Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('transfers.index'))
            ->assertInertia(fn (Assert $page) => $page->has('wallets', 1));
    });

    test('filters transfers by wallet_id matching from or to wallet', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $walletC = Wallet::factory()->for($user)->create();

        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);
        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletB->id, 'to_wallet_id' => $walletA->id]);
        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletB->id, 'to_wallet_id' => $walletC->id]);

        $this->actingAs($user)
            ->get(route('transfers.index', ['wallet_id' => $walletA->id]))
            ->assertInertia(fn (Assert $page) => $page->has('transfers.data', 2));
    });

    test('filters transfers by date_from', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'transacted_at' => '2024-01-10 00:00:00']);
        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'transacted_at' => '2024-01-20 00:00:00']);

        $this->actingAs($user)
            ->get(route('transfers.index', ['date_from' => '2024-01-15']))
            ->assertInertia(fn (Assert $page) => $page->has('transfers.data', 1));
    });

    test('filters transfers by date_to', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'transacted_at' => '2024-01-10 00:00:00']);
        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'transacted_at' => '2024-01-20 00:00:00']);

        $this->actingAs($user)
            ->get(route('transfers.index', ['date_to' => '2024-01-15']))
            ->assertInertia(fn (Assert $page) => $page->has('transfers.data', 1));
    });

    test('wallet_id must belong to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $otherWallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('transfers.index', ['wallet_id' => $otherWallet->id]))
            ->assertSessionHasErrors('wallet_id');
    });

    test('date_to must be after or equal to date_from', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('transfers.index', ['date_from' => '2024-01-20', 'date_to' => '2024-01-10']))
            ->assertSessionHasErrors('date_to');
    });

    test('includes filters in the response', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->get(route('transfers.index', ['wallet_id' => $wallet->id, 'date_from' => '2024-01-01', 'date_to' => '2024-01-31']))
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.wallet_id', $wallet->id)
                ->where('filters.date_from', '2024-01-01')
                ->where('filters.date_to', '2024-01-31')
            );
    });

    test('includes stats grouped by currency', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create(['currency' => 'USD']);
        $walletB = Wallet::factory()->for($user)->create(['currency' => 'USD']);

        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'amount' => 100]);
        Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'amount' => 200]);

        $this->actingAs($user)
            ->get(route('transfers.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('stats', 1)
                ->where('stats.0.currency', 'USD')
                ->where('stats.0.count', 2)
                ->where('stats.0.volume', 300.0)
            );
    });
});

describe('create', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('transfers.create'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the create transfer page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('transfers.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('transfers/create'));
    });

    test('includes wallets belonging to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Wallet::factory()->for($user)->create();
        Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('transfers.create'))
            ->assertInertia(fn (Assert $page) => $page->has('wallets', 1));
    });
});

describe('store', function () use (&$validTransactedAt) {
    test('guests are redirected to the login page', function () {
        $this->post(route('transfers.store'), [])
            ->assertRedirect(route('login'));
    });

    test('creates a transfer and redirects to the index with a success message', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 100,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertRedirect(route('transfers.index'))
            ->assertSessionHas('success', 'Transfer created.');
    });

    test('stores the transfer in the database', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)->post(route('transfers.store'), [
            'from_wallet_id' => $walletA->id,
            'to_wallet_id' => $walletB->id,
            'amount' => 250,
            'transacted_at' => $validTransactedAt,
        ]);

        $this->assertDatabaseHas('transfers', [
            'user_id' => $user->id,
            'from_wallet_id' => $walletA->id,
            'to_wallet_id' => $walletB->id,
            'amount' => 250,
        ]);
    });

    test('from_wallet_id is required', function () {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), ['to_wallet_id' => $wallet->id, 'amount' => 100, 'transacted_at' => '2024-01-15T10:30:00.000Z'])
            ->assertSessionHasErrors('from_wallet_id');
    });

    test('to_wallet_id is required', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), ['from_wallet_id' => $wallet->id, 'amount' => 100, 'transacted_at' => $validTransactedAt])
            ->assertSessionHasErrors('to_wallet_id');
    });

    test('from_wallet_id must belong to the authenticated user', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $otherWallet = Wallet::factory()->for($other)->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $otherWallet->id,
                'to_wallet_id' => $wallet->id,
                'amount' => 100,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasErrors('from_wallet_id');
    });

    test('to_wallet_id must belong to the authenticated user', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $wallet->id,
                'to_wallet_id' => $otherWallet->id,
                'amount' => 100,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasErrors('to_wallet_id');
    });

    test('from_wallet_id and to_wallet_id must be different', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $wallet = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $wallet->id,
                'to_wallet_id' => $wallet->id,
                'amount' => 100,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasErrors('to_wallet_id');
    });

    test('amount is required', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasErrors('amount');
    });

    test('amount must be at least 0.01', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 0,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasErrors('amount');
    });

    test('transacted_at is required', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 100,
            ])
            ->assertSessionHasErrors('transacted_at');
    });

    test('transacted_at must be a valid ISO 8601 datetime', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 100,
                'transacted_at' => '2024-01-15',
            ])
            ->assertSessionHasErrors('transacted_at');
    });

    test('notes is optional', function () use (&$validTransactedAt) {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();

        $this->actingAs($user)
            ->post(route('transfers.store'), [
                'from_wallet_id' => $walletA->id,
                'to_wallet_id' => $walletB->id,
                'amount' => 100,
                'transacted_at' => $validTransactedAt,
            ])
            ->assertSessionHasNoErrors();
    });
});

describe('show', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->get(route('transfers.show', $transfer))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the transfer show page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.show', $transfer))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('transfers/show'));
    });

    test('returns 403 when the transfer belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($other)->create();
        $walletB = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $other->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.show', $transfer))
            ->assertForbidden();
    });

    test('includes from_wallet and to_wallet', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.show', $transfer))
            ->assertInertia(fn (Assert $page) => $page
                ->has('transfer.from_wallet')
                ->has('transfer.to_wallet')
            );
    });
});

describe('edit', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->get(route('transfers.edit', $transfer))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can visit the edit transfer page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.edit', $transfer))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('transfers/edit'));
    });

    test('returns 403 when the transfer belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($other)->create();
        $walletB = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $other->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.edit', $transfer))
            ->assertForbidden();
    });

    test('includes from_wallet and to_wallet on the transfer', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->get(route('transfers.edit', $transfer))
            ->assertInertia(fn (Assert $page) => $page
                ->has('transfer.from_wallet')
                ->has('transfer.to_wallet')
                ->has('wallets')
            );
    });
});

describe('update', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->patch(route('transfers.update', $transfer), [])
            ->assertRedirect(route('login'));
    });

    test('returns 403 when the transfer belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($other)->create();
        $walletB = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $other->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['amount' => 500])
            ->assertForbidden();
    });

    test('updates the transfer and redirects back with a success message', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id, 'amount' => 100]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['amount' => 500])
            ->assertRedirect()
            ->assertSessionHas('success', 'Transfer updated.');

        expect($transfer->fresh()->amount)->toBe(500.0);
    });

    test('amount must be at least 0.01', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['amount' => 0])
            ->assertSessionHasErrors('amount');
    });

    test('from_wallet_id must belong to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['from_wallet_id' => $otherWallet->id])
            ->assertSessionHasErrors('from_wallet_id');
    });

    test('to_wallet_id must belong to the authenticated user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $otherWallet = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['to_wallet_id' => $otherWallet->id])
            ->assertSessionHasErrors('to_wallet_id');
    });

    test('from_wallet_id and to_wallet_id must be different', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->patch(route('transfers.update', $transfer), ['from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletA->id])
            ->assertSessionHasErrors('to_wallet_id');
    });
});

describe('destroy', function () {
    test('guests are redirected to the login page', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->delete(route('transfers.destroy', $transfer))
            ->assertRedirect(route('login'));
    });

    test('returns 403 when the transfer belongs to another user', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $walletA = Wallet::factory()->for($other)->create();
        $walletB = Wallet::factory()->for($other)->create();
        $transfer = Transfer::factory()->create(['user_id' => $other->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->delete(route('transfers.destroy', $transfer))
            ->assertForbidden();
    });

    test('deletes the transfer and redirects to the index with a success message', function () {
        $user = User::factory()->create();
        $walletA = Wallet::factory()->for($user)->create();
        $walletB = Wallet::factory()->for($user)->create();
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'from_wallet_id' => $walletA->id, 'to_wallet_id' => $walletB->id]);

        $this->actingAs($user)
            ->delete(route('transfers.destroy', $transfer))
            ->assertRedirect(route('transfers.index'))
            ->assertSessionHas('success', 'Transfer deleted.');

        $this->assertSoftDeleted('transfers', ['id' => $transfer->id]);
    });
});
