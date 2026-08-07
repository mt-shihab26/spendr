# Settings

**Route prefix:** `/settings` — `settings.*`
**Page files:** `resources/js/pages/settings/*.tsx`
**Layout:** `SettingsLayout` (wraps `AppLayout`; adds a left settings sub-nav within the page content area)

---

## Shell

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Settings / Profile                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Settings                                                       │
│  Manage your profile and account settings                       │
│                                                                 │
│  ┌──────────────┬──────────────────────────────────────────┐   │
│  │ 👤 Profile   │                                          │   │
│  │ 🔒 Security  │   PAGE CONTENT                           │   │
│  │ 🎨 Appearance│                                          │   │
│  └──────────────┴──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

The left sub-nav is part of the page content, not the app header.

---

## Profile — `settings.profile.edit`

**Route:** `GET /settings/profile`

```
┌────────────────────────────────────────────┐
│ Profile                                    │
│ Update your name and email address         │
│ ──────────────────────────────────────     │
│ Name *                                     │
│ [______________________________]           │
│                                            │
│ Email *                                    │
│ [______________________________]           │
│ ⚠ Email not verified. [Resend link]        │
│ (shown only when unverified)               │
│                                            │
│                          [Save changes]    │
│                                            │
│ ─────────────────────────────────────────  │
│ Delete Account                             │
│ Permanently deletes your account and data  │
│                          [Delete account]  │
└────────────────────────────────────────────┘
```

`PATCH /settings/profile`. "Delete account" opens a confirm dialog requiring password entry.

---

## Security — `settings.security.edit`

**Route:** `GET /settings/security`

```
┌────────────────────────────────────────────┐
│ Security                                   │
│ Password and two-factor authentication     │
│ ──────────────────────────────────────     │
│ Change Password                            │
│ Current password  [____________________]  │
│ New password      [____________________]  │
│ Confirm password  [____________________]  │
│                         [Update password] │
│                                            │
│ ──────────────────────────────────────     │
│ Two-Factor Authentication       [Enable]   │
│ (when enabled: QR code + recovery codes)   │
│                                            │
│ ──────────────────────────────────────     │
│ Passkeys                      [+ Add]      │
│ MacBook Touch ID  01 Aug 2026  [Remove]    │
└────────────────────────────────────────────┘
```

- Password change → `PUT /settings/password`
- 2FA enable flow: show QR + setup key → confirm TOTP code → enabled
- 2FA enabled state: "Disable" + "Regenerate recovery codes" + "Show codes"
- Passkeys: WebAuthn registration; each passkey shows device label + date + Remove button

---

## Appearance — `settings.appearance.edit`

**Route:** `GET /settings/appearance`

```
┌────────────────────────────────────────────┐
│ Appearance                                 │
│ Customise how Spendr looks                 │
│ ──────────────────────────────────────     │
│ Theme                                      │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│ │ ☀ Light │  │ ● System│  │ ☾ Dark  │    │
│ └─────────┘  └─────────┘  └─────────┘    │
└────────────────────────────────────────────┘
```

Stored in `localStorage`, applied as a class on `<html>`. No server round-trip.
