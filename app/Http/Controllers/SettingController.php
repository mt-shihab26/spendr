<?php

namespace App\Http\Controllers;

use App\Enums\Currency;
use App\Http\Requests\Settings\NotificationsUpdateRequest;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\PreferencesUpdateRequest;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use App\Models\File;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Response;
use Laravel\Fortify\Features;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): RedirectResponse
    {
        return redirect()->route('settings.profile.edit');
    }

    /**
     * Show the user's profile settings page.
     */
    public function profileEdit(Request $request): Response
    {
        return inertia('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function profileUpdate(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return redirect()->back()->with('success', 'Profile updated.');
    }

    /**
     * Upload or replace the user's profile picture.
     */
    public function avatarUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        $old = $user->fresh()->avatarFile;
        if ($old) {
            Storage::disk('local')->delete($old->path);
            $old->delete();
        }

        $uploaded = $request->file('avatar');
        $uuid = (string) Str::uuid();
        $extension = $uploaded->getClientOriginalExtension();
        $directory = File::resolveDirectory($user->id, User::class);
        $filename = File::resolveFilename($uuid, $extension);

        Storage::disk('local')->putFileAs($directory, $uploaded, $filename);

        File::create([
            'id' => $uuid,
            'user_id' => $user->id,
            'fileable_type' => User::class,
            'fileable_id' => $user->id,
            'name' => $uploaded->getClientOriginalName(),
            'path' => $directory.'/'.$filename,
            'mime_type' => $uploaded->getMimeType() ?? 'image/jpeg',
            'size' => $uploaded->getSize(),
        ]);

        return redirect()->back()->with('success', 'Profile picture updated.');
    }

    /**
     * Remove the user's profile picture.
     */
    public function avatarDestroy(Request $request): RedirectResponse
    {
        $avatar = $request->user()->fresh()->avatarFile;

        if ($avatar) {
            Storage::disk('local')->delete($avatar->path);
            $avatar->delete();
        }

        return redirect()->back()->with('success', 'Profile picture removed.');
    }

    /**
     * Serve the user's profile picture inline from private storage.
     */
    public function avatarShow(Request $request, File $file): StreamedResponse
    {
        abort_if($file->user_id !== $request->user()->id, 403);

        return response()->stream(
            fn () => print (Storage::disk('local')->get($file->path) ?? ''),
            200,
            [
                'Content-Type' => $file->mime_type,
                'Content-Disposition' => 'inline',
                'Cache-Control' => 'private, max-age=86400',
            ],
        );
    }

    /**
     * Delete the user's profile.
     */
    public function profileDestroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Show the user's security settings page.
     */
    public function securityEdit(TwoFactorAuthenticationRequest $request): Response
    {
        $props = [
            'canManageTwoFactor' => Features::canManageTwoFactorAuthentication(),
            'canManagePasskeys' => Features::canManagePasskeys(),
            'passkeys' => Features::canManagePasskeys()
                ? $request->user()
                    ->passkeys()
                    ->select(['id', 'name', 'credential', 'created_at', 'last_used_at'])
                    ->latest()
                    ->get()
                    ->map(fn ($passkey) => [
                        'id' => $passkey->id,
                        'name' => $passkey->name,
                        'authenticator' => $passkey->authenticator,
                        'created_at_diff' => $passkey->created_at->diffForHumans(),
                        'last_used_at_diff' => $passkey->last_used_at?->diffForHumans(),
                    ])
                    ->values()
                    ->all()
                : [],
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ];

        if (Features::canManageTwoFactorAuthentication()) {
            $request->ensureStateIsValid();

            $props['twoFactorEnabled'] = $request->user()->hasEnabledTwoFactorAuthentication();
            $props['requiresConfirmation'] = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm');
        }

        return inertia('settings/security', $props);
    }

    /**
     * Update the user's password.
     */
    public function passwordUpdate(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->password,
        ]);

        return redirect()->back()->with('success', 'Password updated.');
    }

    /**
     * Show the user's appearance settings page.
     */
    public function appearanceEdit(Request $request): Response
    {
        return inertia('settings/appearance', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Show the user's preferences settings page.
     */
    public function preferencesEdit(Request $request): Response
    {
        $defaults = [
            'default_currency' => Currency::BDT->value,
            'first_day_of_week' => 'monday',
        ];

        return inertia('settings/preferences', [
            'preferences' => array_merge($defaults, array_intersect_key($request->user()->preferences ?? [], $defaults)),
            'currencies' => array_map(fn (Currency $c) => $c->value, Currency::cases()),
        ]);
    }

    /**
     * Update the user's preferences.
     */
    public function preferencesUpdate(PreferencesUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->preferences = array_merge($user->preferences ?? [], $request->validated());
        $user->save();

        return redirect()->back()->with('success', 'Preferences updated.');
    }

    /**
     * Show the user's notification settings page.
     */
    public function notificationsEdit(Request $request): Response
    {
        $defaults = [
            'notify_budget_alerts' => true,
            'notify_budget_alert_threshold' => 80,
            'notify_goal_milestones' => true,
            'notify_recurring_reminders' => true,
        ];

        return inertia('settings/notifications', [
            'preferences' => array_merge($defaults, array_intersect_key($request->user()->preferences ?? [], $defaults)),
        ]);
    }

    /**
     * Update the user's notification preferences.
     */
    public function notificationsUpdate(NotificationsUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->preferences = array_merge($user->preferences ?? [], $request->validated());
        $user->save();

        return redirect()->back()->with('success', 'Notification preferences updated.');
    }

    /**
     * Show the data export settings page.
     */
    public function dataEdit(Request $request): Response
    {
        return inertia('settings/data');
    }

    /**
     * Export all user data as a ZIP archive containing multiple CSVs.
     */
    public function dataExport(Request $request): HttpResponse|StreamedResponse
    {
        $user = $request->user();

        return response()->streamDownload(function () use ($user) {
            $path = tempnam(sys_get_temp_dir(), 'spendr_export_');
            $zip = new ZipArchive;
            $zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            $zip->addFromString('wallets.csv', $this->buildCsv(
                ['Name', 'Currency', 'Initial Balance', 'Is Default', 'Created At'],
                $user->wallets()->get(),
                fn ($w) => [$w->name, $w->currency, $w->initial_balance, $w->is_default ? 'Yes' : 'No', $w->created_at],
            ));

            $zip->addFromString('categories.csv', $this->buildCsv(
                ['Name', 'Type', 'Is Default', 'Created At'],
                $user->categories()->get(),
                fn ($c) => [$c->name, $c->type, $c->is_default ? 'Yes' : 'No', $c->created_at],
            ));

            $zip->addFromString('transactions.csv', $this->buildCsv(
                ['Date', 'Description', 'Type', 'Amount', 'Category', 'Wallet', 'Notes'],
                $user->transactions()->with(['category', 'wallet'])->latest('transacted_at')->get(),
                fn ($t) => [$t->transacted_at, $t->description, $t->type, $t->amount, $t->category?->name, $t->wallet?->name, $t->notes],
            ));

            $zip->addFromString('transfers.csv', $this->buildCsv(
                ['Date', 'Amount', 'From Wallet', 'To Wallet', 'Notes'],
                $user->transfers()->with(['fromWallet', 'toWallet'])->latest('transacted_at')->get(),
                fn ($t) => [$t->transacted_at, $t->amount, $t->fromWallet?->name, $t->toWallet?->name, $t->notes],
            ));

            $zip->addFromString('goals.csv', $this->buildCsv(
                ['Name', 'Currency', 'Target Amount', 'Current Amount', 'Target Date', 'Description', 'Created At'],
                $user->goals()->get(),
                fn ($g) => [$g->name, $g->currency, $g->target_amount, $g->current_amount, $g->target_date, $g->description, $g->created_at],
            ));

            $zip->addFromString('budgets.csv', $this->buildCsv(
                ['Category', 'Amount (JSON)', 'Created At'],
                $user->budgets()->with('category')->get(),
                fn ($b) => [$b->category?->name, json_encode($b->amount), $b->created_at],
            ));

            $zip->addFromString('recurring-transactions.csv', $this->buildCsv(
                ['Description', 'Type', 'Amount', 'Frequency', 'Next Due', 'Is Active', 'Wallet', 'Category'],
                $user->recurringTransactions()->with(['wallet', 'category'])->get(),
                fn ($r) => [$r->description, $r->type, $r->amount, $r->frequency, $r->next_due_at, $r->is_active ? 'Yes' : 'No', $r->wallet?->name, $r->category?->name],
            ));

            $zip->close();

            readfile($path);
            unlink($path);
        }, 'spendr-export.zip', ['Content-Type' => 'application/zip']);
    }

    /**
     * Build a CSV string from a collection of rows.
     *
     * @param  array<string>  $headers
     * @param  iterable<Model>  $rows
     */
    private function buildCsv(array $headers, iterable $rows, \Closure $mapper): string
    {
        $buffer = fopen('php://temp', 'r+');

        if ($buffer === false) {
            throw new \RuntimeException('Failed to open temporary stream.');
        }

        fputcsv($buffer, $headers);

        foreach ($rows as $row) {
            fputcsv($buffer, $mapper($row));
        }

        rewind($buffer);
        $csv = stream_get_contents($buffer);
        fclose($buffer);

        if ($csv === false) {
            throw new \RuntimeException('Failed to read from temporary stream.');
        }

        return $csv;
    }
}
