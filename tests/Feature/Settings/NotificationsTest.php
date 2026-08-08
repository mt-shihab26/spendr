<?php

use App\Models\User;

test('notifications settings page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.notifications.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/notifications')
        ->has('preferences')
    );
});

test('notification preferences can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('settings.notifications.edit'))
        ->patch(route('settings.notifications.update'), [
            'notify_budget_alerts' => false,
            'notify_budget_alert_threshold' => 90,
            'notify_goal_milestones' => true,
            'notify_recurring_reminders' => false,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.notifications.edit'));

    $user->refresh();

    expect($user->getPreference('notify_budget_alerts'))->toBeFalse();
    expect($user->getPreference('notify_budget_alert_threshold'))->toBe(90);
    expect($user->getPreference('notify_goal_milestones'))->toBeTrue();
    expect($user->getPreference('notify_recurring_reminders'))->toBeFalse();
});

test('notification preferences rejects invalid threshold', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('settings.notifications.edit'))
        ->patch(route('settings.notifications.update'), [
            'notify_budget_alerts' => true,
            'notify_budget_alert_threshold' => 150,
            'notify_goal_milestones' => true,
            'notify_recurring_reminders' => true,
        ]);

    $response->assertSessionHasErrors('notify_budget_alert_threshold');
});

test('existing preferences are preserved when updating notifications', function () {
    $user = User::factory()->create([
        'preferences' => [
            'default_currency' => 'USD',
            'timezone' => 'Asia/Dhaka',
        ],
    ]);

    $this
        ->actingAs($user)
        ->patch(route('settings.notifications.update'), [
            'notify_budget_alerts' => true,
            'notify_budget_alert_threshold' => 80,
            'notify_goal_milestones' => true,
            'notify_recurring_reminders' => true,
        ]);

    $user->refresh();

    expect($user->getPreference('default_currency'))->toBe('USD');
    expect($user->getPreference('timezone'))->toBe('Asia/Dhaka');
});
