<?php

use App\Support\Geolocation;

/**
 * Resolve the monthly display price for the current visitor.
 * Falls back to the default price when no locale override matches.
 */
if (! function_exists('resolvedMonthlyPrice')) {
    function resolvedMonthlyPrice(): string
    {
        $overrides = config('pricing.locale_overrides', []);
        $timezone = app(Geolocation::class)->timezone();

        return ($timezone && isset($overrides[$timezone])) ? $overrides[$timezone] : config('pricing.monthly');
    }
}
