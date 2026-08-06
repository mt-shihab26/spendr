# Settings

**Route prefix:** `/settings` — `settings.*`
**Page files:** `resources/js/pages/settings/*.tsx`
**Layout:** `SettingsLayout` (wraps `AppLayout` with a settings sidebar)

All settings pages share a two-column layout: a left nav and a right content panel.

---

## Settings Shell — `SettingsLayout`

```
┌──────────────────────────────────────────────────────────┐
│ AppLayout header + sidebar                               │
├──────────────────────────────────────────────────────────┤
│ Settings                                                 │
│ Manage your profile and account settings                 │
│                                                          │
│ ┌─────────────┬────────────────────────────────────────┐ │
│ │ [👤 Profile]│                                        │ │
│ │ [🔒 Security│   PAGE CONTENT (see sections below)   │ │
│ │ [🎨 Appear.]│                                        │ │
│ └─────────────┴────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Profile — `settings.profile.edit`

**Route:** `GET /settings/profile`

```
┌────────────────────────────────────────────┐
│ Profile                                    │
│ Update your name and email address         │
│ ──────────────────────────────────────     │
│  Name *                                    │
│  [______________________________]          │
│                                            │
│  Email *                                   │
│  [______________________________]          │
│  ⚠ Email not verified. [Resend link]       │
│  (banner shown only when unverified)       │
│                                            │
│                         [Save changes]     │
│                                            │
│ ─────────────────────────────────────────  │
│ Delete Account                             │
│ Permanently delete your account and all   │
│ associated data.                           │
│                         [Delete account]  │
└────────────────────────────────────────────┘
```

Saving triggers `PATCH /settings/profile`. On email change the user is shown a verification banner.

"Delete account" opens a confirmation dialog requiring password entry.

---

## Security — `settings.security.edit`

**Route:** `GET /settings/security`

```
┌────────────────────────────────────────────┐
│ Security                                   │
│ Password and two-factor authentication     │
│ ──────────────────────────────────────     │
│  Change Password                           │
│  Current password                          │
│  [______________________________]          │
│  New password                              │
│  [______________________________]          │
│  Confirm new password                      │
│  [______________________________]          │
│                         [Update password]  │
│                                            │
│ ──────────────────────────────────────     │
│ Two-Factor Authentication                  │
│                                            │
│  [Disabled]                                │
│  ── or when enabled ──                     │
│  [QR Code + setup key shown on enable]     │
│  Recovery codes: [Show codes]              │
│                        [Disable 2FA]       │
│                                            │
│ ──────────────────────────────────────     │
│ Passkeys                                   │
│ Sign in without a password.                │
│  [+ Add passkey]                           │
│  MacBook Touch ID   Added 01 Aug  [Remove] │
└────────────────────────────────────────────┘
```

### Change Password

`PUT /settings/password`. Requires current password.

### Two-Factor Authentication

- **Disabled state:** "Enable" button → shows QR code + setup key → prompts for TOTP code to confirm.
- **Enabled state:** Shows "Disable" button + "Regenerate recovery codes" + "Show recovery codes" toggle.

### Passkeys

Lists registered passkeys with their device label and date added. "Add passkey" triggers WebAuthn registration. Each passkey has a Remove button.

---

## Appearance — `settings.appearance.edit`

**Route:** `GET /settings/appearance`

```
┌────────────────────────────────────────────┐
│ Appearance                                 │
│ Customise how Spendr looks                 │
│ ──────────────────────────────────────     │
│  Theme                                     │
│                                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ ☀ Light │  │ ● System│  │ ☾ Dark  │   │
│  └─────────┘  └─────────┘  └─────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

Selection is stored client-side (localStorage) and applied via a class on `<html>`. No server round-trip.
