# Auth Screens

**Layout:** `AuthLayout`
**Page files:** `resources/js/pages/auth/*.tsx`
**Managed by:** Laravel Fortify

All auth screens share a centred card layout with the app logo at the top. No sidebar or header.

---

## Login — `/login`

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│       Sign in to Spendr       │
│                               │
│  Email                        │
│  [______________________]     │
│                               │
│  Password                     │
│  [______________________] 👁  │
│                               │
│  ☐ Remember me   [Forgot?]   │
│                               │
│      [Sign in]                │
│                               │
│  Don't have an account?       │
│  [Register]                   │
│                               │
│  ── or ──                     │
│  [Sign in with passkey]       │
└───────────────────────────────┘
```

**Actions**
- Email + password → POST `/login`
- "Forgot?" link → `/forgot-password`
- "Register" link → `/register`
- Passkey sign-in → triggers WebAuthn flow

---

## Register — `/register`

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│        Create account         │
│                               │
│  Name                         │
│  [______________________]     │
│                               │
│  Email                        │
│  [______________________]     │
│                               │
│  Password                     │
│  [______________________] 👁  │
│                               │
│  Confirm Password             │
│  [______________________] 👁  │
│                               │
│      [Create account]         │
│                               │
│  Already have an account?     │
│  [Sign in]                    │
└───────────────────────────────┘
```

On success → POST `/register` → redirected to `/dashboard`. Default wallet and categories are seeded.

---

## Forgot Password — `/forgot-password`

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│       Forgot password?        │
│                               │
│  Enter your email and we'll   │
│  send a reset link.           │
│                               │
│  Email                        │
│  [______________________]     │
│                               │
│      [Send reset link]        │
│                               │
│      [Back to login]          │
└───────────────────────────────┘
```

---

## Reset Password — `/reset-password/{token}`

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│        Reset password         │
│                               │
│  Email                        │
│  [______________________]     │
│                               │
│  New Password                 │
│  [______________________] 👁  │
│                               │
│  Confirm Password             │
│  [______________________] 👁  │
│                               │
│      [Reset Password]         │
└───────────────────────────────┘
```

---

## Two-Factor Challenge — `/two-factor-challenge`

Shown after successful password login when 2FA is enabled.

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│   Two-factor authentication   │
│                               │
│  Enter the 6-digit code from  │
│  your authenticator app.      │
│                               │
│  Code                         │
│  [_ _ _ _ _ _]               │
│                               │
│      [Verify]                 │
│                               │
│  Use a recovery code instead  │
└───────────────────────────────┘
```

Toggle "Use a recovery code" swaps the 6-digit input for a text field that accepts a recovery code.

---

## Verify Email — `/email/verify`

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│      Verify your email        │
│                               │
│  We sent a verification link  │
│  to your email address.       │
│  Click the link to continue.  │
│                               │
│  [Resend verification email]  │
│                               │
│  [Log out]                    │
└───────────────────────────────┘
```

---

## Confirm Password — `/confirm-password`

Shown before sensitive actions (e.g. disabling 2FA) when the session has aged.

```
┌───────────────────────────────┐
│          [Spendr Logo]        │
│       Confirm password        │
│                               │
│  Please re-enter your         │
│  password to continue.        │
│                               │
│  Password                     │
│  [______________________] 👁  │
│                               │
│      [Confirm]                │
└───────────────────────────────┘
```
