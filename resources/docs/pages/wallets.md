# Wallets

**Route prefix:** `/wallets` — `wallets.*`
**Layout:** `AppLayout`

Users manage multiple wallets (cash, bank account, credit card, etc.). Balance is always derived — never stored directly.

---

## Wallet List — `wallets.index`

**Route:** `GET /wallets`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Wallets                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Wallets                                      [+ New Wallet]   │
│  Manage your accounts and balances                             │
│                                                                 │
│  Net Worth: $4,250.00                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ● Main Wallet        USD        [Default]     $2,100  ⋮ │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ● Cash               USD                       $350   ⋮ │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ● Bank Account       USD                     $1,800   ⋮ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Row actions (⋮ menu)

- View Details → `wallets.show`
- Edit → `wallets.edit`
- Set as Default _(hidden when already default)_
- Delete _(disabled with tooltip when wallet has transactions)_

### Empty state

Icon + "No wallets yet" + "Create your first wallet" button → `wallets.create`.

---

## Wallet Detail — `wallets.show`

**Route:** `GET /wallets/{wallet}`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Wallets / Main Wallet                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Main Wallet                                            [Edit]  │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Balance      │   │ Month Income │   │Month Expenses│        │
│  │ $2,100.00    │   │ $2,100.00    │   │ $1,780.00    │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ [Aug 2026 ◀ ▶]                     [Type: All ▾]   │       │
│  │ ─────────────────────────────────────────────────── │       │
│  │ 06 Aug                                              │       │
│  │   🛒 Groceries      Food              -$45.00       │       │
│  │   ☕ Coffee         Food               -$5.50       │       │
│  │ 01 Aug                                              │       │
│  │   💼 Salary         Income          +$2,100.00      │       │
│  │ ─────────────────────────────────────────────────── │       │
│  │                              [Load more]            │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

[Edit] button → `wallets.edit`. Transactions grouped by date; clicking a row navigates to `transactions.edit`.

---

## Create Wallet — `wallets.create`

**Route:** `GET /wallets/create`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Wallets / New Wallet                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Wallet                                                     │
│  Add a new account to track                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Name *                                                  │   │
│  │ [___________________________________________________]   │   │
│  │                                                         │   │
│  │ Currency *                                              │   │
│  │ [USD ▾]                                                 │   │
│  │                                                         │   │
│  │ Initial Balance                                         │   │
│  │ [$ 0.00_____________________________________________]   │   │
│  │                                                         │   │
│  │ Color *                                                 │   │
│  │ [● ● ● ● ● ● ● ●]  (swatches)                         │   │
│  │                                                         │   │
│  │ Icon                                                    │   │
│  │ [wallet ▾]                                              │   │
│  │                                                         │   │
│  │ ☐ Set as default wallet                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                              [Cancel]  [Create Wallet]         │
└─────────────────────────────────────────────────────────────────┘
```

| Field           | Rules                              |
| --------------- | ---------------------------------- |
| Name            | required, max 100, unique per user |
| Currency        | required, ISO 4217, default USD    |
| Initial Balance | min 0, default 0                   |
| Color           | required                           |
| Icon            | optional                           |
| Set as default  | unchecked by default               |

On success → redirects to `wallets.show`. Cancel → `wallets.index`.

---

## Edit Wallet — `wallets.edit`

**Route:** `GET /wallets/{wallet}/edit`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Wallets / Main Wallet / Edit                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edit Wallet                                                    │
│  Update account details                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ (same fields as Create, pre-filled)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Delete Wallet]               [Cancel]  [Save Changes]        │
│   ↑ danger, far left                                           │
└─────────────────────────────────────────────────────────────────┘
```

On success → redirects to `wallets.show`. "Delete Wallet" is disabled with a tooltip when the wallet has transactions.

---

## Delete Confirmation — inline dialog

Triggered from the Edit page "Delete Wallet" button or the ⋮ row menu.

```
┌─────────────────────────────────────┐
│ Delete "Cash"?                      │
│ ──────────────────────────────────  │
│ This cannot be undone. Reassign or  │
│ delete all transactions first.      │
│                                     │
│             [Cancel]  [Delete]      │
└─────────────────────────────────────┘
```
