# Wallets

**Route prefix:** `/wallets` — `wallets.*`
**Layout:** `AppLayout`

Users manage multiple wallets (cash, bank, credit card, etc.). Balance is always derived — never stored.

---

## Wallet List — `wallets.index`

**Route:** `GET /wallets`

```
┌──────────────────────────────────────────────────────────┐
│ Wallets                              [+ New Wallet]       │
│ Manage your accounts and balances                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Net Worth: $4,250.00                                    │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ● Main Wallet         USD      [Default]    $2,100   │ │
│ │   Created 01 Aug 2026          ⋮                     │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ● Cash                USD                    $350    │ │
│ │   Created 01 Aug 2026          ⋮                     │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ● Bank Account        USD                  $1,800    │ │
│ │   Created 01 Aug 2026          ⋮                     │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Row actions (⋮ menu)

- View Details
- Edit
- Set as Default _(hidden if already default)_
- Delete _(disabled with tooltip if wallet has transactions)_

### Empty state

Icon + "You have no wallets yet" + "Create your first wallet" button.

---

## Wallet Detail — `wallets.show`

**Route:** `GET /wallets/{wallet}`

```
┌──────────────────────────────────────────────────────────┐
│ ← Wallets  /  Main Wallet                                │
│                                                          │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│ │ Balance     │  │ Income      │  │ Expenses    │        │
│ │ $2,100.00   │  │ $2,100.00   │  │ $1,780.00   │        │
│ │ (all time)  │  │ (this month)│  │ (this month)│        │
│ └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Transactions                        [Filter ▾] [Edit]│ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ [Month picker: Aug 2026 ◀ ▶]   [Type: All ▾]        │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ 06 Aug                                               │ │
│ │   🛒 Groceries      Food        -$45.00              │ │
│ │   ☕ Coffee         Food        -$5.50               │ │
│ │ 01 Aug                                               │ │
│ │   💼 Salary         Income    +$2,100.00             │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │                        [Load more]                   │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Filters

- Month picker (prev/next arrows, defaults to current month)
- Type dropdown: All · Income · Expense · Transfer

### Transaction rows

Grouped by date. Each row: category icon · description · category name · amount (colored). Clicking a row opens the edit modal.

---

## Create Wallet — `wallets.create`

**Route:** `GET /wallets/create`
**Rendered as:** Slide-over panel or full page.

```
┌────────────────────────────────────┐
│ New Wallet                    [✕]  │
│ ─────────────────────────────────  │
│ Name *                             │
│ [___________________________]      │
│                                    │
│ Currency *                         │
│ [USD ▾]                            │
│                                    │
│ Initial Balance                    │
│ [$  0.00________________]          │
│                                    │
│ Color                              │
│ [● ● ● ● ● ● ● ●] (swatches)      │
│                                    │
│ Icon                               │
│ [wallet ▾]                         │
│                                    │
│ ☐ Set as default wallet            │
│                                    │
│            [Cancel]  [Create Wallet│
└────────────────────────────────────┘
```

### Fields

| Field | Type | Rules |
|-------|------|-------|
| Name | text | required, max 100, unique per user |
| Currency | select (ISO 4217) | required, default USD |
| Initial Balance | decimal | min 0, default 0 |
| Color | color swatch picker | required |
| Icon | icon picker | optional |
| Set as default | checkbox | — |

---

## Edit Wallet — `wallets.edit`

**Route:** `GET /wallets/{wallet}/edit`

Same form as Create, pre-filled. Includes a "Delete Wallet" danger button at the bottom (shown only when no transactions are linked, otherwise disabled with explanation).

---

## Delete Confirmation Dialog

Triggered from the ⋮ row menu or the Edit page danger button.

```
┌────────────────────────────────────┐
│ Delete "Cash"?                     │
│ ─────────────────────────────────  │
│ This action cannot be undone.      │
│ All associated transactions must   │
│ be reassigned or deleted first.    │
│                                    │
│            [Cancel]  [Delete]      │
└────────────────────────────────────┘
```

If the wallet has transactions, the Delete button is disabled and a message explains why.
