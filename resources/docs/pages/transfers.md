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
│  │ 05 Aug  Main Wallet  →  Cash            $200.00     ⋮   │   │
│  │ 29 Jul  Bank Acc     →  Main Wallet     $500.00     ⋮   │   │
│  │ 15 Jul  Main Wallet  →  Cash            $100.00     ⋮   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                       ← 1  2  3 →                              │
└─────────────────────────────────────────────────────────────────┘
```

### Filter bar

| Control        | Behaviour                                                 |
| -------------- | --------------------------------------------------------- |
| Date from / to | Inclusive range on `transacted_at`                        |
| Wallet         | Shows transfers where the wallet is source or destination |

### Row actions (⋮)

- Edit → opens Edit modal
- Delete → confirm dialog

---

## Create Transfer — modal

```
┌───────────────────────────────────────┐
│ New Transfer                     [✕]  │
│ ────────────────────────────────────  │
│ Amount *                              │
│ [$ ________________________________]  │
│                                       │
│ From Wallet *                         │
│ [Select wallet ▾]                     │
│                                       │
│ To Wallet *                           │
│ [Select wallet ▾]                     │
│ (same as From is disabled)            │
│                                       │
│ Date *                                │
│ [06 Aug 2026]                         │
│                                       │
│ Notes                                 │
│ [__________________________________]  │
│                                       │
│           [Cancel]  [Save Transfer]   │
└───────────────────────────────────────┘
```

| Field       | Rules                           |
| ----------- | ------------------------------- |
| Amount      | required, > 0                   |
| From Wallet | required; must differ from To   |
| To Wallet   | required; must differ from From |
| Date        | required; defaults to today     |
| Notes       | optional                        |

---

## Edit Transfer — modal

Same form, pre-filled. Includes "Delete" danger button.

---

## Delete Confirmation

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
