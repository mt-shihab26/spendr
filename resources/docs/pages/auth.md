# Auth Screens

**Layout:** `AuthLayout` (centred card, no header or navigation)
**Page files:** `resources/js/pages/auth/*.tsx`
**Managed by:** Laravel Fortify

---

## Login — `/login`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│       Sign in to Spendr       │
│                               │
│ Email                         │
│ [___________________________] │
│                               │
│ Password                      │
│ [___________________________] │
│                               │
│ ☐ Remember me    [Forgot →]   │
│                               │
│         [Sign in]             │
│                               │
│ Don't have an account?        │
│         [Register]            │
│                               │
│ ─────── or ───────            │
│   [Sign in with passkey]      │
└───────────────────────────────┘
```

---

## Register — `/register`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│        Create account         │
│                               │
│ Name                          │
│ [___________________________] │
│                               │
│ Email                         │
│ [___________________________] │
│                               │
│ Password                      │
│ [___________________________] │
│                               │
│ Confirm Password              │
│ [___________________________] │
│                               │
│       [Create account]        │
│                               │
│ Already have an account?      │
│         [Sign in]             │
└───────────────────────────────┘
```

On success → `POST /register` → `/dashboard`. Default wallet and categories are seeded.

---

## Forgot Password — `/forgot-password`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│       Forgot password?        │
│                               │
│ Enter your email and we'll    │
│ send a reset link.            │
│                               │
│ Email                         │
│ [___________________________] │
│                               │
│      [Send reset link]        │
│       [Back to login]         │
└───────────────────────────────┘
```

---

## Reset Password — `/reset-password/{token}`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│        Reset password         │
│                               │
│ Email                         │
│ [___________________________] │
│                               │
│ New Password                  │
│ [___________________________] │
│                               │
│ Confirm Password              │
│ [___________________________] │
│                               │
│       [Reset Password]        │
└───────────────────────────────┘
```

---

## Two-Factor Challenge — `/two-factor-challenge`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│  Two-factor authentication    │
│                               │
│ Enter the 6-digit code from   │
│ your authenticator app.       │
│                               │
│ Code                          │
│ [_ _ _ _ _ _]                 │
│                               │
│         [Verify]              │
│                               │
│  Use a recovery code instead  │
└───────────────────────────────┘
```

Toggling "Use a recovery code" swaps the input for a plain text field.

---

## Verify Email — `/email/verify`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│      Verify your email        │
│                               │
│ A verification link has been  │
│ sent to your email address.   │
│                               │
│  [Resend verification email]  │
│          [Log out]            │
└───────────────────────────────┘
```

---

## Confirm Password — `/confirm-password`

```
┌───────────────────────────────┐
│         [Spendr Logo]         │
│       Confirm password        │
│                               │
│ Re-enter your password to     │
│ continue.                     │
│                               │
│ Password                      │
│ [___________________________] │
│                               │
│          [Confirm]            │
└───────────────────────────────┘
```
