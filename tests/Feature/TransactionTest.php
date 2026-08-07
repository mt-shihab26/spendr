<?php

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('transactions can be filtered by date range', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    $make = fn (string $description, string $date) => Transaction::factory()
        ->for($user)->for($wallet)->for($category)
        ->create(['description' => $description, 'transacted_at' => $date]);

    $make('August A', '2026-08-06');
    $make('August B', '2026-08-01');
    $make('July', '2026-07-15');

    $this->actingAs($user)
        ->get(route('transactions.index', ['date_from' => '2026-08-01', 'date_to' => '2026-08-31']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('transactions.data', 2)
            ->where('transactions.data.0.description', 'August A')
            ->where('transactions.data.1.description', 'August B'),
        );
});

test('transactions show all when no date filter is applied', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    Transaction::factory()->for($user)->for($wallet)->for($category)
        ->create(['description' => 'This month', 'transacted_at' => '2026-08-01']);
    Transaction::factory()->for($user)->for($wallet)->for($category)
        ->create(['description' => 'Last month', 'transacted_at' => '2026-07-31']);

    $this->actingAs($user)
        ->get(route('transactions.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('transactions.data', 2),
        );
});

test('transactions reject an invalid date_from', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('transactions.index', ['date_from' => 'not-a-date']))
        ->assertSessionHasErrors('date_from');
});

test('transactions can be filtered by type', function () {
    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    Transaction::factory()->for($user)->for($wallet)->for($category)
        ->income()->create(['description' => 'Income tx']);
    Transaction::factory()->for($user)->for($wallet)->for($category)
        ->expense()->create(['description' => 'Expense tx']);

    $this->actingAs($user)
        ->get(route('transactions.index', ['type' => 'income']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->has('transactions.data', 1)
            ->where('transactions.data.0.description', 'Income tx'),
        );
});

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
