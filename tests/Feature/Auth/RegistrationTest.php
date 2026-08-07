<?php

use App\Enums\Type;
use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('default categories are created when a new user registers', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')->firstOrFail();

    $expectedExpense = count(config('seeds.expense_categories'));
    $expectedIncome = count(config('seeds.income_categories'));

    expect($user->categories()->where('type', Type::Expense)->count())->toBe($expectedExpense)
        ->and($user->categories()->where('type', Type::Income)->count())->toBe($expectedIncome)
        ->and($user->categories()->where('is_default', true)->count())->toBe($expectedExpense + $expectedIncome);
});
