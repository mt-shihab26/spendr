<?php

use App\Support\Geolocation;

/**
 * Resolve the current visitor's IANA timezone, cached by IP for 30 days.
 * Returns null when the IP cannot be geolocated (e.g. localhost).
 */
if (! function_exists('userTimezone')) {
    function userTimezone(): ?string
    {
        return app(Geolocation::class)->timezone();
    }
}

/**
 * Resolve the monthly display price for the current visitor.
 * Falls back to the default price when no locale override matches.
 */
if (! function_exists('resolvedMonthlyPrice')) {
    function resolvedMonthlyPrice(): string
    {
        $overrides = config('pricing.locale_overrides', []);

        $timezone = userTimezone();

        return ($timezone && isset($overrides[$timezone])) ? $overrides[$timezone] : config('pricing.monthly');
    }
}
