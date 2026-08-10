<?php

use App\Models\User;

test('data export page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.data.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('settings/data')
    );
});

test('data export downloads a zip file', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.data.export'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/zip');
    $response->assertHeader('Content-Disposition', 'attachment; filename=spendr-export.zip');
});

test('data export only includes the authenticated user data', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $user->wallets()->create([
        'name' => 'My Wallet',
        'currency' => 'BDT',
        'initial_balance' => 1000,
        'color' => '#000000',
        'icon' => 'wallet',
    ]);

    $response = $this
        ->actingAs($other)
        ->get(route('settings.data.export'));

    $response->assertOk();

    $zip = new ZipArchive;
    $tmpFile = tempnam(sys_get_temp_dir(), 'test_export_');
    file_put_contents($tmpFile, $response->streamedContent());

    expect($zip->open($tmpFile))->toBeTrue();

    $walletsCsv = $zip->getFromName('wallets.csv');
    expect($walletsCsv)->not->toContain('My Wallet');

    $zip->close();
    unlink($tmpFile);
});
