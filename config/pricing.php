<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trial Days
    |--------------------------------------------------------------------------
    |
    | Number of days in the free trial period, shown in the hero and pricing
    | sections.
    |
    */
    'trial_days' => env('PRICING_TRIAL_DAYS', 30),

    /*
    |--------------------------------------------------------------------------
    | Monthly Price
    |--------------------------------------------------------------------------
    |
    | Default display price shown to all visitors. Use locale_overrides below
    | to show a different price based on the visitor's timezone.
    |
    */
    'monthly' => env('PRICING_MONTHLY', '$4.99'),

    /*
    |--------------------------------------------------------------------------
    | Locale Overrides
    |--------------------------------------------------------------------------
    |
    | Map IANA timezone identifiers to a display price. When the visitor's
    | timezone matches a key here, that price is shown instead of the default.
    |
    */
    'locale_overrides' => [
        'Asia/Dhaka' => env('PRICING_MONTHLY_BDT', '৳499'),
    ],

];
