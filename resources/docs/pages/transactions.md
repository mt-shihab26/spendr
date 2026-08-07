# Transactions

**Route prefix:** `/transactions` — `transactions.*`
**Layout:** `AppLayout`

Full log of all income and expense entries across all wallets.

---

## Transaction List — `transactions.index`

**Route:** `GET /transactions`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transactions                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Transactions                          [+ New Transaction]      │
│  All income and expenses                                        │
│                                                                 │
│  [🔍 Search…]  [Type ▾]  [Wallet ▾]  [Category ▾]              │
│  [Date from ___]  [Date to ___]              [Clear filters]    │
│                                                                 │
│  Showing 42 transactions · Aug 2026                  [CSV ↓]   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 06 Aug                                                  │   │
│  │   🛒  Groceries       Food        Main       -$45.00  → │   │
│  │   ☕  Coffee          Food        Cash        -$5.50  → │   │
│  │ 01 Aug                                                  │   │
│  │   💼  Salary          Income      Main    +$2,100.00  → │   │
│  │ 31 Jul                                                  │   │
│  │   🚌  Bus pass        Transport   Main       -$28.00  → │   │
│  └─────────────────────────────────────────────────────────┘   │
│                      ← 1  2  3  4  5 →                         │
└─────────────────────────────────────────────────────────────────┘
```

### Filter bar

| Control        | Behaviour                                        |
| -------------- | ------------------------------------------------ |
| Search         | Debounced `LIKE %term%` on `description`         |
| Type           | All / Income / Expense                           |
| Wallet         | User's wallets                                   |
| Category       | User's categories; narrows when Type is selected |
| Date from / to | Inclusive range on `transacted_at`               |
| Clear filters  | Resets all controls                              |

Rows grouped by date. Each row has a `→` chevron — clicking navigates to `transactions.edit`.

---

## Create Transaction — `transactions.create`

**Route:** `GET /transactions/create`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transactions / New Transaction                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Transaction                                                │
│  Record an income or expense                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type *                                                  │   │
│  │ ┌─────────────┐  ┌─────────────┐                       │   │
│  │ │  ● Expense  │  │   Income    │                       │   │
│  │ └─────────────┘  └─────────────┘                       │   │
│  │                                                         │   │
│  │ Amount *                                                │   │
│  │ [$ _________________________________________________]   │   │
│  │                                                         │   │
│  │ Description *                                           │   │
│  │ [___________________________________________________]   │   │
│  │                                                         │   │
│  │ Category *                                              │   │
│  │ [Select category ▾]  (filtered by selected Type)       │   │
│  │                                                         │   │
│  │ Wallet *                                                │   │
│  │ [Main Wallet ▾]                                         │   │
│  │                                                         │   │
│  │ Date *                                                  │   │
│  │ [06 Aug 2026]                                           │   │
│  │                                                         │   │
│  │ Notes                                                   │   │
│  │ [___________________________________________________]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                           [Cancel]  [Save Transaction]         │
└─────────────────────────────────────────────────────────────────┘
```

| Field       | Rules                                       |
| ----------- | ------------------------------------------- |
| Type        | required, default Expense                   |
| Amount      | required, > 0                               |
| Description | required, max 255                           |
| Category    | required; filtered by selected type         |
| Wallet      | required; defaults to user's default wallet |
| Date        | required; defaults to today                 |
| Notes       | optional                                    |

Switching Type clears Category and reloads the dropdown. On success → redirects to `transactions.index`. Cancel → `transactions.index`.

---

## Edit Transaction — `transactions.edit`

**Route:** `GET /transactions/{transaction}/edit`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Transactions / Edit Transaction                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edit Transaction                                               │
│  Update or delete this entry                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ (same fields as Create, pre-filled)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Delete]                      [Cancel]  [Save Changes]        │
│   ↑ danger, far left                                           │
└─────────────────────────────────────────────────────────────────┘
```

On success → redirects to `transactions.index`.

---

## Delete Confirmation — inline dialog

Triggered from the Edit page "Delete" button.

```
┌───────────────────────────────────────┐
│ Delete transaction?                   │
│ ────────────────────────────────────  │
│ "Groceries" — $45.00 on 06 Aug 2026   │
│ This cannot be undone.                │
│                                       │
│            [Cancel]  [Delete]         │
└───────────────────────────────────────┘
```
