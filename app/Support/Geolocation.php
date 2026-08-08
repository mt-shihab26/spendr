<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Stevebauman\Location\LocationManager;

class Geolocation
{
    /**
     * Resolve the current visitor's IANA timezone, cached by IP for 30 days.
     * Returns null when the IP cannot be geolocated (e.g. localhost).
     */
    public function timezone(): ?string
    {
        $ip = request()->ip();

        if (in_array($ip, ['127.0.0.1', '::1'])) {
            $ip = Cache::remember('host_public_ip', now()->addHours(1), function (): string {
                return trim(Http::get('https://api.ipify.org')->body());
            });
        }

        return Cache::remember("user_timezone.{$ip}", now()->addDays(30), function () use ($ip): ?string {
            $position = app(LocationManager::class)->get($ip);

            return $position ? $position->timezone : null;
        });
    }
}
