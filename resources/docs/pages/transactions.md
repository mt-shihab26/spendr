# Transactions

**Route prefix:** `/transactions` — `transactions.*`
**Layout:** `AppLayout`

Full log of all income and expense entries across all wallets. Supports rich filtering and inline editing.

---

## Transaction List — `transactions.index`

**Route:** `GET /transactions`

```
┌──────────────────────────────────────────────────────────────┐
│ Transactions                           [+ New Transaction]    │
│ All income and expenses                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [🔍 Search description…]  [Type ▾]  [Wallet ▾]  [Category ▾]│
│ [Date from ___]  [Date to ___]               [Clear filters] │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │  Showing 42 transactions  •  Aug 2026           [CSV ↓]│  │
│ ├──────┬────────────────┬──────────┬─────────┬──────────┤  │
│ │ Date │ Description    │ Category │ Wallet  │ Amount   │  │
│ ├──────┴────────────────┴──────────┴─────────┴──────────┤  │
│ │ 06 Aug                                                 │  │
│ │  🛒  Groceries         Food       Main       -$45.00   │  │
│ │  ☕  Coffee            Food       Cash        -$5.50   │  │
│ │ 01 Aug                                                 │  │
│ │  💼  Salary            Income     Main    +$2,100.00   │  │
│ │ 31 Jul                                                 │  │
│ │  🚌  Bus pass          Transport  Main       -$28.00   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│              ← 1  2  3  4  5 →   (pagination)               │
└──────────────────────────────────────────────────────────────┘
```

### Filter bar

| Control             | Type        | Behaviour                                                   |
| ------------------- | ----------- | ----------------------------------------------------------- |
| Search              | text input  | debounced `LIKE %term%` on `description`                    |
| Type                | select      | All / Income / Expense                                      |
| Wallet              | select      | populated from user's wallets                               |
| Category            | select      | populated from user's categories, filtered by selected Type |
| Date from / Date to | date inputs | inclusive range on `transacted_at`                          |
| Clear filters       | button      | resets all controls                                         |

### List rows

Grouped by date header. Each row:

- Category icon (colored circle matching category color)
- Description
- Category name
- Wallet name
- Amount — green `+$x.xx` for income, red `-$x.xx` for expense

Clicking a row → opens Edit modal (not a new page).

### Export

"CSV ↓" button downloads the currently filtered result set.

---

## Create Transaction — modal or slide-over

Opened from the "[+ New Transaction]" button or the Quick-Add FAB.

```
┌────────────────────────────────────────┐
│ New Transaction                   [✕]  │
│ ───────────────────────────────────    │
│  Type                                  │
│  ┌──────────┐  ┌──────────┐           │
│  │ ● Expense│  │  Income  │           │
│  └──────────┘  └──────────┘           │
│                                        │
│  Amount *                              │
│  [$ ___________________________]       │
│                                        │
│  Description *                         │
│  [________________________________]    │
│                                        │
│  Category *                            │
│  [Select category ▾]                   │
│  (filtered to selected Type)           │
│                                        │
│  Wallet *                              │
│  [Main Wallet ▾]  (defaults to default │
│                    wallet)             │
│                                        │
│  Date *                                │
│  [06 Aug 2026___]  (defaults to today) │
│                                        │
│  Notes                                 │
│  [________________________________]    │
│  [________________________________]    │
│                                        │
│          [Cancel]  [Save Transaction]  │
└────────────────────────────────────────┘
```

### Fields

| Field       | Type                      | Rules                                       |
| ----------- | ------------------------- | ------------------------------------------- |
| Type        | toggle (Expense / Income) | required, defaults to Expense               |
| Amount      | decimal input             | required, > 0                               |
| Description | text                      | required, max 255                           |
| Category    | select                    | required; list filtered by selected type    |
| Wallet      | select                    | required; defaults to user's default wallet |
| Date        | date picker               | required, defaults to today                 |
| Notes       | textarea                  | optional                                    |

Switching **Type** clears the Category selection and repopulates the dropdown.

### Validation

Inline field-level errors. Submit is disabled until all required fields are valid.

---

## Edit Transaction — modal

Same form as Create, pre-filled. Includes a "Delete" button (danger, bottom-left).

**Route:** `GET /transactions/{transaction}/edit` _(also accessible as a modal)_

---

## Delete Confirmation

```
┌────────────────────────────────────┐
│ Delete transaction?                │
│ ─────────────────────────────────  │
│ "Groceries" — $45.00 on 06 Aug     │
│ This cannot be undone.             │
│                                    │
│            [Cancel]  [Delete]      │
└────────────────────────────────────┘
```
