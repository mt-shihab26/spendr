<?php

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('transactions can be filtered by period', function () {
    Carbon::setTestNow('2026-08-06 12:00:00');

    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    $createTransaction = fn (string $description, string $date) => Transaction::factory()
        ->for($user)
        ->for($wallet)
        ->for($category)
        ->create([
            'description' => $description,
            'transacted_at' => $date,
        ]);

    $createTransaction('Today', '2026-08-06');
    $createTransaction('This week', '2026-08-03');
    $createTransaction('This month', '2026-08-01');
    $createTransaction('This year', '2026-01-01');
    $createTransaction('Last year', '2025-12-31');

    $this->actingAs($user)
        ->get(route('transactions.index', ['period' => 'month']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->where('period', 'month')
            ->has('transactions.data', 3)
            ->where('transactions.data.0.description', 'Today')
            ->where('transactions.data.2.description', 'This month'),
        );
});

test('transactions default to the current month period', function () {
    Carbon::setTestNow('2026-08-06 12:00:00');

    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    Transaction::factory()->for($user)->for($wallet)->for($category)->create([
        'description' => 'This month',
        'transacted_at' => '2026-08-01',
    ]);
    Transaction::factory()->for($user)->for($wallet)->for($category)->create([
        'description' => 'Last month',
        'transacted_at' => '2026-07-31',
    ]);

    $this->actingAs($user)
        ->get(route('transactions.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->where('period', 'month')
            ->has('transactions.data', 1)
            ->where('transactions.data.0.description', 'This month'),
        );
});

test('transactions reject an invalid period', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('transactions.index', ['period' => 'invalid']))
        ->assertSessionHasErrors('period');
});

test('transactions can show all periods', function () {
    Carbon::setTestNow('2026-08-06 12:00:00');

    $user = User::factory()->create();
    $wallet = Wallet::factory()->for($user)->create();
    $category = Category::factory()->for($user)->expense()->create();

    Transaction::factory()->for($user)->for($wallet)->for($category)->create([
        'description' => 'Last year',
        'transacted_at' => '2025-12-31',
    ]);

    $this->actingAs($user)
        ->get(route('transactions.index', ['period' => 'all']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/index')
            ->where('period', 'all')
            ->has('transactions.data', 1),
        );
});

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
