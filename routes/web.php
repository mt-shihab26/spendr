<?php

use App\Http\Controllers\SettingController;
use App\Http\Controllers\WellKnownController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('.well-known/passkey-endpoints', [WellKnownController::class, 'passkeyEndpoints'])->name('well-known.passkeys');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'dashboard')->name('dashboard');

    Route::prefix('/settings')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->withoutMiddleware('verified')->name('settings.index');

        Route::get('/profile', [SettingController::class, 'profileEdit'])->withoutMiddleware('verified')->name('settings.profile.edit');
        Route::patch('/profile', [SettingController::class, 'profileUpdate'])->withoutMiddleware('verified')->name('settings.profile.update');
        Route::delete('/profile', [SettingController::class, 'profileDestroy'])->name('settings.profile.destroy');

        Route::get('/security', [SettingController::class, 'securityEdit'])->middleware(RequirePassword::class)->name('settings.security.edit');
        Route::put('/password', [SettingController::class, 'passwordUpdate'])->middleware('throttle:6,1')->name('settings.password.update');

        Route::get('/appearance', [SettingController::class, 'appearanceEdit'])->name('settings.appearance.edit');
    });
});
