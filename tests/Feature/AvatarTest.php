<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('avatar can be uploaded', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('settings.profile.avatar.update'), [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect();

    expect($user->fresh()->avatarFile)->not->toBeNull();
});

test('non-image files are rejected for avatar', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->from(route('settings.profile.edit'))
        ->post(route('settings.profile.avatar.update'), [
            'avatar' => UploadedFile::fake()->create('resume.pdf', 500),
        ])
        ->assertSessionHasErrors('avatar');
});

test('uploading a new avatar replaces the old one', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)->post(route('settings.profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->image('first.jpg'),
    ]);

    expect($user->fresh()->avatarFile)->not->toBeNull();
    $firstId = $user->fresh()->avatarFile->id;

    $this->actingAs($user)->post(route('settings.profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->image('second.jpg'),
    ]);

    $refreshed = $user->fresh();
    expect($refreshed->avatarFile)->not->toBeNull();
    expect($refreshed->avatarFile->id)->not->toBe($firstId);
    expect($refreshed->files()->count())->toBe(1);
});

test('avatar can be removed', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)->post(route('settings.profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ]);

    expect($user->fresh()->avatarFile)->not->toBeNull();

    $response = $this
        ->actingAs($user)
        ->delete(route('settings.profile.avatar.destroy'));

    $response->assertSessionHasNoErrors()->assertRedirect();
    expect($user->fresh()->avatarFile)->toBeNull();
});
