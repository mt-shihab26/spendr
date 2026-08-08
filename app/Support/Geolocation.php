<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
            $ip = Cache::remember('localhost.public.ip', now()->addHours(1), function (): string {
                $resolved = trim(Http::get('https://api.ipify.org')->body());
                Log::debug('Geolocation: resolved host public IP', ['ip' => $resolved]);

                return $resolved;
            });
        }

        return Cache::remember("user.timezone.{$ip}", now()->addDays(30), function () use ($ip): ?string {
            $position = app(LocationManager::class)->get($ip);
            $timezone = $position ? $position->timezone : null;
            Log::debug('Geolocation: resolved timezone', ['ip' => $ip, 'timezone' => $timezone]);

            return $timezone;
        });
    }
}
