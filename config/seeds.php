<?php

use App\Enums\Currency;

return [

    /*
     * Icons suitable for wallets (finance-themed).
     * Values must match keys in resources/js/lib/icons.ts.
     */
    'wallet_icons' => [
        'Wallet',
        'CreditCard',
        'Banknote',
        'PiggyBank',
        'Receipt',
        'Building2',
        'Briefcase',
        'Smartphone',
        'Star',
        'Shield',
    ],

    /*
     * Icons suitable for categories (full set).
     * Values must match keys in resources/js/lib/icons.ts.
     */
    'category_icons' => [
        'Utensils', 'Coffee', 'Pizza', 'Apple', 'Wine', 'ShoppingCart',
        'Car', 'Plane', 'Bus', 'Train', 'Bike', 'Fuel',
        'ShoppingBag', 'Shirt', 'Tag', 'Gift', 'Package',
        'Home', 'Zap', 'Flame', 'Droplets', 'Lightbulb', 'Wifi', 'Wrench',
        'Heart', 'Dumbbell', 'Pill', 'Stethoscope',
        'Music', 'Film', 'Tv', 'Gamepad2', 'Headphones',
        'BookOpen', 'GraduationCap',
        'Laptop', 'Cpu', 'Watch',
        'Baby', 'PawPrint', 'Scissors', 'Briefcase',
        'Star', 'Shield', 'BadgePercent',
    ],

    /*
     * Default wallet seeded for every new user.
     */
    'default_wallet' => [
        'name' => 'Money Bagg',
        'currency' => Currency::BDT,
        'initial_balance' => 0,
        'color' => '#22c55e',
        'icon' => 'Wallet',
        'is_default' => true,
        'sort_order' => 0,
    ],

    /*
     * Demo wallets seeded for the test user.
     */
    'demo_wallets' => [
        ['name' => 'bKash',        'currency' => 'BDT', 'initial_balance' => 15000, 'color' => '#e2136e', 'icon' => 'Smartphone', 'is_default' => true,  'sort_order' => 1],
        ['name' => 'Bank Account', 'currency' => 'BDT', 'initial_balance' => 80000, 'color' => '#3b82f6', 'icon' => 'Building2',  'is_default' => false, 'sort_order' => 2],
        ['name' => 'Cash',         'currency' => 'BDT', 'initial_balance' => 5000,  'color' => '#22c55e', 'icon' => 'Banknote',   'is_default' => false, 'sort_order' => 3],
        ['name' => 'Wise USD',     'currency' => 'USD', 'initial_balance' => 1200,  'color' => '#14b8a6', 'icon' => 'CreditCard', 'is_default' => false, 'sort_order' => 4],
    ],

    /*
     * Demo budgets: category name → per-currency limits (null = no limit for that currency).
     */
    'demo_budgets' => [
        'Food'          => ['BDT' => 15000, 'USD' => null],
        'Transport'     => ['BDT' => 8000,  'USD' => null],
        'Shopping'      => ['BDT' => 12000, 'USD' => null],
        'Housing'       => ['BDT' => 20000, 'USD' => null],
        'Entertainment' => ['BDT' => 5000,  'USD' => 60],
        'Health'        => ['BDT' => 5000,  'USD' => null],
        'Education'     => ['BDT' => null,  'USD' => 50],
    ],

    /*
     * Demo goals seeded for the test user.
     */
    'demo_goals' => [
        ['name' => 'Emergency Fund',       'currency' => 'BDT', 'target_amount' => 300000,  'current_amount' => 185000, 'color' => '#22c55e', 'icon' => 'Shield', 'months_ahead' => 8],
        ['name' => 'Vacation to Thailand', 'currency' => 'USD', 'target_amount' => 2000,    'current_amount' => 620,    'color' => '#3b82f6', 'icon' => 'Plane',  'months_ahead' => 5],
        ['name' => 'New Laptop',           'currency' => 'USD', 'target_amount' => 1500,    'current_amount' => 390,    'color' => '#a855f7', 'icon' => 'Laptop', 'months_ahead' => 3],
        ['name' => 'Home Down Payment',    'currency' => 'BDT', 'target_amount' => 1500000, 'current_amount' => 210000, 'color' => '#f59e0b', 'icon' => 'Home',   'months_ahead' => 36],
    ],

    /*
     * Demo recurring transactions seeded for the test user.
     */
    'demo_recurring' => [
        ['wallet' => 'Bank Account', 'category' => 'Salary',       'type' => 'income',  'amount' => 55000, 'description' => 'Monthly Salary',      'frequency' => 'monthly', 'due_day' => 1],
        ['wallet' => 'bKash',        'category' => 'Housing',       'type' => 'expense', 'amount' => 18000, 'description' => 'House Rent',           'frequency' => 'monthly', 'due_day' => 3],
        ['wallet' => 'Wise USD',     'category' => 'Entertainment', 'type' => 'expense', 'amount' => 15.99, 'description' => 'Netflix Subscription', 'frequency' => 'monthly', 'due_day' => 5],
        ['wallet' => 'Wise USD',     'category' => 'Education',     'type' => 'expense', 'amount' => 19.99, 'description' => 'Duolingo Plus',        'frequency' => 'monthly', 'due_day' => 12],
        ['wallet' => 'bKash',        'category' => 'Transport',     'type' => 'expense', 'amount' => 1200,  'description' => 'Monthly Bus Pass',     'frequency' => 'monthly', 'due_day' => 1],
        ['wallet' => 'Wise USD',     'category' => 'Education',     'type' => 'expense', 'amount' => 9.99,  'description' => 'Spotify Premium',      'frequency' => 'monthly', 'due_day' => 7],
    ],

    /*
     * Default expense categories seeded for every new user.
     */
    'expense_categories' => [
        ['name' => 'Food',          'color' => '#f97316', 'icon' => 'Utensils'],
        ['name' => 'Transport',     'color' => '#3b82f6', 'icon' => 'Car'],
        ['name' => 'Shopping',      'color' => '#a855f7', 'icon' => 'ShoppingBag'],
        ['name' => 'Entertainment', 'color' => '#ec4899', 'icon' => 'Film'],
        ['name' => 'Health',        'color' => '#10b981', 'icon' => 'Heart'],
        ['name' => 'Housing',       'color' => '#f59e0b', 'icon' => 'Home'],
        ['name' => 'Education',     'color' => '#6366f1', 'icon' => 'BookOpen'],
        ['name' => 'Other',         'color' => '#6b7280', 'icon' => 'Star'],
    ],

    /*
     * Default income categories seeded for every new user.
     */
    'income_categories' => [
        ['name' => 'Salary',        'color' => '#22c55e', 'icon' => 'Briefcase'],
        ['name' => 'Freelance',     'color' => '#14b8a6', 'icon' => 'Laptop'],
        ['name' => 'Investment',    'color' => '#eab308', 'icon' => 'BadgePercent'],
        ['name' => 'Gift',          'color' => '#f43f5e', 'icon' => 'Gift'],
        ['name' => 'Miscellaneous', 'color' => '#6b7280', 'icon' => 'Package'],
    ],

];
