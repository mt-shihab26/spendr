# Transfers

**Route prefix:** `/transfers` — `transfers.*`
**Layout:** `AppLayout`

Moves money between two of the user's wallets. Recorded separately from transactions so income/expense totals stay accurate.

---

## Transfer List — `transfers.index`

**Route:** `GET /transfers`

```
┌──────────────────────────────────────────────────────────┐
│ Transfers                              [+ New Transfer]   │
│ Move funds between your wallets                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Date from ___]  [Date to ___]  [Wallet ▾]               │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Date    From          To           Amount          │  │
│ ├────────────────────────────────────────────────────┤  │
│ │ 05 Aug  Main Wallet → Cash         $200.00    ⋮    │  │
│ │ 29 Jul  Bank Acc    → Main Wallet  $500.00    ⋮    │  │
│ │ 15 Jul  Main Wallet → Cash         $100.00    ⋮    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│              ← 1  2  3 →                                 │
└──────────────────────────────────────────────────────────┘
```

### Filter bar

| Control | Type | Behaviour |
|---------|------|-----------|
| Date from / Date to | date inputs | inclusive range on `transacted_at` |
| Wallet | select | shows transfers where wallet is either source or destination |

### Row actions (⋮)

- Edit
- Delete

---

## Create Transfer — modal

Opened from "[+ New Transfer]" or the Quick-Add FAB.

```
┌────────────────────────────────────────┐
│ New Transfer                      [✕]  │
│ ───────────────────────────────────    │
│  Amount *                              │
│  [$ ___________________________]       │
│                                        │
│  From Wallet *                         │
│  [Select wallet ▾]                     │
│                                        │
│  To Wallet *                           │
│  [Select wallet ▾]                     │
│  (same wallet as "From" is disabled)   │
│                                        │
│  Date *                                │
│  [06 Aug 2026]  (defaults to today)    │
│                                        │
│  Notes                                 │
│  [________________________________]    │
│                                        │
│          [Cancel]  [Save Transfer]     │
└────────────────────────────────────────┘
```

### Fields

| Field | Type | Rules |
|-------|------|-------|
| Amount | decimal | required, > 0 |
| From Wallet | select | required; must differ from To |
| To Wallet | select | required; must differ from From |
| Date | date picker | required, defaults to today |
| Notes | textarea | optional |

Selecting the same wallet for both From and To shows an inline error.

---

## Edit Transfer — modal

Same form as Create, pre-filled. Includes "Delete" button.

---

## Delete Confirmation

```
┌────────────────────────────────────┐
│ Delete transfer?                   │
│ ─────────────────────────────────  │
│ Main Wallet → Cash, $200.00        │
│ on 05 Aug 2026                     │
│ This cannot be undone.             │
│                                    │
│            [Cancel]  [Delete]      │
└────────────────────────────────────┘
```
