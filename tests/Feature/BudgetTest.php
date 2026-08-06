<?php

use App\Models\Budget;
use App\Models\Category;
use App\Models\User;

test('budgets index lists the authenticated user budgets', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();
    Budget::factory()->for($user)->create(['category_id' => $category->id]);

    $other = User::factory()->create();
    $otherCategory = Category::factory()->for($other)->expense()->create();
    Budget::factory()->for($other)->create(['category_id' => $otherCategory->id]);

    $this->actingAs($user)
        ->get(route('budgets.index'))
        ->assertOk();

    expect(Budget::where('user_id', $user->id)->count())->toBe(1);
});

test('budgets store creates a budget for the authenticated user', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();

    $this->actingAs($user)
        ->post(route('budgets.store'), [
            'category_id' => $category->id,
            'amount' => 500.00,
        ])
        ->assertRedirect();

    expect(Budget::where('user_id', $user->id)->where('category_id', $category->id)->exists())->toBeTrue();
});

test('budgets store rejects an income category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->income()->create();

    $this->actingAs($user)
        ->post(route('budgets.store'), [
            'category_id' => $category->id,
            'amount' => 500.00,
        ])
        ->assertSessionHasErrors('category_id');
});

test('budgets store rejects a duplicate category budget', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();
    Budget::factory()->for($user)->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->post(route('budgets.store'), [
            'category_id' => $category->id,
            'amount' => 200.00,
        ])
        ->assertSessionHasErrors('category_id');
});

test('budgets update changes the budget amount', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();
    $budget = Budget::factory()->for($user)->create(['category_id' => $category->id, 'amount' => 100]);

    $this->actingAs($user)
        ->patch(route('budgets.update', $budget), ['amount' => 999.99])
        ->assertRedirect();

    expect($budget->fresh()->amount)->toBe(999.99);
});

test('budgets destroy deletes the budget', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();
    $budget = Budget::factory()->for($user)->create(['category_id' => $category->id]);

    $this->actingAs($user)
        ->delete(route('budgets.destroy', $budget))
        ->assertRedirect(route('budgets.index'));

    expect(Budget::find($budget->id))->toBeNull();
});

test('budgets are not accessible by another user', function () {
    $user = User::factory()->create();
    $category = Category::factory()->for($user)->expense()->create();
    $budget = Budget::factory()->for($user)->create(['category_id' => $category->id]);

    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('budgets.show', $budget))
        ->assertForbidden();
});
