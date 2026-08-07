<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RecurringTransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WellKnownController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('.well-known/passkey-endpoints', [WellKnownController::class, 'passkeyEndpoints'])->name('well-known.passkeys');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/search', [SearchController::class, 'index'])->name('search');

    Route::prefix('/notifications')->group(function () {
        Route::patch('/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
        Route::patch('/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    });

    Route::prefix('/files')->group(function () {
        Route::get('/{file}', [FileController::class, 'show'])->name('files.show');
        Route::delete('/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    });
    Route::post('/transactions/{transaction}/files', [FileController::class, 'storeForTransaction'])->name('transactions.files.store');

    Route::prefix('/wallets')->group(function () {
        Route::get('/', [WalletController::class, 'index'])->name('wallets.index');
        Route::get('/create', [WalletController::class, 'create'])->name('wallets.create');
        Route::post('/', [WalletController::class, 'store'])->name('wallets.store');
        Route::get('/{wallet}', [WalletController::class, 'show'])->name('wallets.show');
        Route::get('/{wallet}/edit', [WalletController::class, 'edit'])->name('wallets.edit');
        Route::patch('/{wallet}', [WalletController::class, 'update'])->name('wallets.update');
        Route::delete('/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');
    });

    Route::prefix('/transactions')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('transactions.index');
        Route::get('/export', [TransactionController::class, 'export'])->name('transactions.export');
        Route::get('/import', [TransactionController::class, 'importForm'])->name('transactions.import');
        Route::post('/import', [TransactionController::class, 'import'])->name('transactions.import.store');
        Route::delete('/bulk', [TransactionController::class, 'bulkDestroy'])->name('transactions.bulk-destroy');
        Route::patch('/bulk/reassign', [TransactionController::class, 'bulkReassign'])->name('transactions.bulk-reassign');
        Route::get('/create', [TransactionController::class, 'create'])->name('transactions.create');
        Route::post('/', [TransactionController::class, 'store'])->name('transactions.store');
        Route::get('/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::get('/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
        Route::patch('/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
        Route::delete('/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
    });

    Route::prefix('/transfers')->group(function () {
        Route::get('/', [TransferController::class, 'index'])->name('transfers.index');
        Route::get('/create', [TransferController::class, 'create'])->name('transfers.create');
        Route::post('/', [TransferController::class, 'store'])->name('transfers.store');
        Route::get('/{transfer}', [TransferController::class, 'show'])->name('transfers.show');
        Route::get('/{transfer}/edit', [TransferController::class, 'edit'])->name('transfers.edit');
        Route::patch('/{transfer}', [TransferController::class, 'update'])->name('transfers.update');
        Route::delete('/{transfer}', [TransferController::class, 'destroy'])->name('transfers.destroy');
    });

    Route::prefix('/categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('/{category}', [CategoryController::class, 'show'])->name('categories.show');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::patch('/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    Route::prefix('/budgets')->group(function () {
        Route::get('/', [BudgetController::class, 'index'])->name('budgets.index');
        Route::get('/create', [BudgetController::class, 'create'])->name('budgets.create');
        Route::post('/', [BudgetController::class, 'store'])->name('budgets.store');
        Route::get('/{budget}', [BudgetController::class, 'show'])->name('budgets.show');
        Route::get('/{budget}/edit', [BudgetController::class, 'edit'])->name('budgets.edit');
        Route::patch('/{budget}', [BudgetController::class, 'update'])->name('budgets.update');
        Route::delete('/{budget}', [BudgetController::class, 'destroy'])->name('budgets.destroy');
    });

    Route::prefix('/recurring-transactions')->group(function () {
        Route::get('/', [RecurringTransactionController::class, 'index'])->name('recurring-transactions.index');
        Route::get('/create', [RecurringTransactionController::class, 'create'])->name('recurring-transactions.create');
        Route::post('/', [RecurringTransactionController::class, 'store'])->name('recurring-transactions.store');
        Route::get('/{recurringTransaction}', [RecurringTransactionController::class, 'show'])->name('recurring-transactions.show');
        Route::get('/{recurringTransaction}/edit', [RecurringTransactionController::class, 'edit'])->name('recurring-transactions.edit');
        Route::patch('/{recurringTransaction}', [RecurringTransactionController::class, 'update'])->name('recurring-transactions.update');
        Route::delete('/{recurringTransaction}', [RecurringTransactionController::class, 'destroy'])->name('recurring-transactions.destroy');
    });

    Route::prefix('/goals')->group(function () {
        Route::get('/', [GoalController::class, 'index'])->name('goals.index');
        Route::get('/create', [GoalController::class, 'create'])->name('goals.create');
        Route::post('/', [GoalController::class, 'store'])->name('goals.store');
        Route::get('/{goal}', [GoalController::class, 'show'])->name('goals.show');
        Route::get('/{goal}/edit', [GoalController::class, 'edit'])->name('goals.edit');
        Route::patch('/{goal}', [GoalController::class, 'update'])->name('goals.update');
        Route::delete('/{goal}', [GoalController::class, 'destroy'])->name('goals.destroy');
    });

    Route::prefix('/reports')->group(function () {
        Route::get('/', [ReportsController::class, 'index'])->name('reports.index');
    });

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
