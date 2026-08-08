<?php

namespace App\Http\Middleware;

use App\Enums\Currency;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'components/layouts/app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn () => [...(new Ziggy)->toArray(), 'location' => $request->url()],
            'name' => config('app.name'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'auth' => fn () => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'avatar' => $request->user()->avatarFile?->url(),
                ]) : null,
            ],
            'preferences' => fn () => array_merge([
                'default_currency' => Currency::BDT->value,
                'first_day_of_week' => 'monday',
                'notify_budget_alerts' => true,
                'notify_budget_alert_threshold' => 80,
                'notify_goal_milestones' => true,
                'notify_recurring_reminders' => true,
            ], $request->user()?->preferences ?? []),
            'notifications' => fn () => $request->user()
                ? $request->user()->unreadNotifications()->latest()->take(10)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'type' => class_basename($n->type),
                    'data' => $n->data,
                    'created_at' => $n->created_at,
                ])->values()
                : [],

        ];
    }
}
