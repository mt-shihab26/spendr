# Transfers

**Route prefix:** `/transfers` — `transfers.*`
**Layout:** `AppLayout`

Moves money between two of the user's wallets. Kept separate from transactions so income/expense totals stay accurate.

---

## Transfer List — `transfers.index`

**Route:** `GET /transfers`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transfers                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Transfers                                  [+ New Transfer]   │
│  Move funds between your wallets                               │
│                                                                 │
│  [Date from ___]  [Date to ___]  [Wallet ▾]                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Date    From             To              Amount         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 05 Aug  Main Wallet  →  Cash            $200.00     →   │   │
│  │ 29 Jul  Bank Acc     →  Main Wallet     $500.00     →   │   │
│  │ 15 Jul  Main Wallet  →  Cash            $100.00     →   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                       ← 1  2  3 →                              │
│                                                          [+]   │
└─────────────────────────────────────────────────────────────────┘
```

### Filter bar

| Control        | Behaviour                                                 |
| -------------- | --------------------------------------------------------- |
| Date from / to | Inclusive range on `transacted_at`                        |
| Wallet         | Shows transfers where the wallet is source or destination |

Each row has a `→` chevron that navigates to `transfers.edit`. "[+ New Transfer]" button and the Quick-Add FAB both navigate to `transfers.create`.

---

## Create Transfer — `transfers.create`

**Route:** `GET /transfers/create`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transfers / New Transfer                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Transfer                                                   │
│  Move funds between your wallets                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Amount *                                                │   │
│  │ [$ _________________________________________________]   │   │
│  │                                                         │   │
│  │ From Wallet *                                           │   │
│  │ [Select wallet ▾]                                       │   │
│  │                                                         │   │
│  │ To Wallet *                                             │   │
│  │ [Select wallet ▾]   (same as From is disabled)         │   │
│  │                                                         │   │
│  │ Date *                                                  │   │
│  │ [06 Aug 2026]                                           │   │
│  │                                                         │   │
│  │ Notes                                                   │   │
│  │ [___________________________________________________]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                             [Cancel]  [Save Transfer]          │
└─────────────────────────────────────────────────────────────────┘
```

| Field       | Rules                           |
| ----------- | ------------------------------- |
| Amount      | required, > 0                   |
| From Wallet | required; must differ from To   |
| To Wallet   | required; must differ from From |
| Date        | required; defaults to today     |
| Notes       | optional                        |

On success → redirects to `transfers.index`. Cancel → `transfers.index`.

---

## Edit Transfer — `transfers.edit`

**Route:** `GET /transfers/{transfer}/edit`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transfers / Edit Transfer                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edit Transfer                                                  │
│  Update or delete this transfer                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ (same fields as Create, pre-filled)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Delete]                       [Cancel]  [Save Changes]       │
│   ↑ danger, far left                                           │
└─────────────────────────────────────────────────────────────────┘
```

On success → redirects to `transfers.index`.

---

## Delete Confirmation — inline dialog

```
┌───────────────────────────────────────┐
│ Delete transfer?                      │
│ ────────────────────────────────────  │
│ Main Wallet → Cash, $200.00           │
│ on 05 Aug 2026. Cannot be undone.     │
│                                       │
│            [Cancel]  [Delete]         │
└───────────────────────────────────────┘
```
