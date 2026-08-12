<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Wallet Limit
    |--------------------------------------------------------------------------
    |
    | Maximum number of wallets a single user is allowed to create.
    |
    */
    'wallets' => env('LIMIT_WALLETS', 100),

    /*
    |--------------------------------------------------------------------------
    | Recurring Transaction Limit
    |--------------------------------------------------------------------------
    |
    | Maximum number of recurring transactions a single user is allowed to create.
    |
    */
    'recurring_transactions' => env('LIMIT_RECURRING_TRANSACTIONS', 100),

];
