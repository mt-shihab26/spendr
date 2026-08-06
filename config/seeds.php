<?php

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
