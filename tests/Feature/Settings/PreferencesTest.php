<?php

use App\Models\User;

test('preferences page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.preferences.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/preferences')
        ->has('preferences')
        ->has('currencies')
    );
});

test('preferences can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('settings.preferences.edit'))
        ->patch(route('settings.preferences.update'), [
            'default_currency' => 'USD',
            'first_day_of_week' => 'friday',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.preferences.edit'));

    $user->refresh();

    expect($user->getPreference('default_currency'))->toBe('USD');
    expect($user->getPreference('first_day_of_week'))->toBe('friday');
});

test('first day of week accepts any day', function () {
    $user = User::factory()->create();

    foreach (['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as $day) {
        $this
            ->actingAs($user)
            ->patch(route('settings.preferences.update'), [
                'default_currency' => 'BDT',
                'first_day_of_week' => $day,
            ])
            ->assertSessionHasNoErrors();
    }
});

test('preferences update rejects invalid day of week', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->from(route('settings.preferences.edit'))
        ->patch(route('settings.preferences.update'), [
            'default_currency' => 'BDT',
            'first_day_of_week' => 'funday',
        ])
        ->assertSessionHasErrors('first_day_of_week');
});

test('preferences update rejects invalid currency', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('settings.preferences.edit'))
        ->patch(route('settings.preferences.update'), [
            'default_currency' => 'INVALID',
            'first_day_of_week' => 'monday',
        ]);

    $response->assertSessionHasErrors('default_currency');
});
