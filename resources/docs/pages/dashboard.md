# Dashboard

**Route:** `GET /dashboard` — `dashboard`
**Page file:** `resources/js/pages/dashboard.tsx`
**Layout:** `AppLayout` (no breadcrumb bar — dashboard is the root)

First screen after login. Gives a full picture of financial health at a glance.

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Dashboard                              [+ Add Transaction]     │
│  Overview of your account                                       │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │  Net Worth   │   │ Month Income │   │Month Expenses│        │
│  │  $4,250.00   │   │  $2,100.00   │   │  $1,780.00   │        │
│  │  ↑ +$320 vs  │   │  ▲ +12%      │   │  ▼ -3%       │        │
│  │  last month  │   │              │   │              │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│                                                                 │
│  ┌───────────────────────┐   ┌───────────────────────┐         │
│  │ Wallets               │   │ Spending by Category  │         │
│  │ ───────────────────── │   │ ───────────────────── │         │
│  │ ● Main Wallet  $2,100 │   │   [Donut chart]       │         │
│  │ ● Cash           $350 │   │                       │         │
│  │ ● Bank Acc     $1,800 │   │ ● Food    35%   $623  │         │
│  │ ───────────────────── │   │ ● Transport 20% $356  │         │
│  │ Total          $4,250 │   │ ● Other   45%   $801  │         │
│  │          [All Wallets]│   │    [View Full Report] │         │
│  └───────────────────────┘   └───────────────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Recent Transactions                       [View All]│       │
│  │ ─────────────────────────────────────────────────── │       │
│  │ 🛒 Groceries    Food       05 Aug       -$45.00     │       │
│  │ 💼 Salary       Income     01 Aug    +$2,100.00     │       │
│  │ 🚌 Bus pass     Transport  31 Jul       -$28.00     │       │
│  │ 🎬 Netflix      Entertain  30 Jul       -$15.99     │       │
│  │ 💻 Freelance    Income     28 Jul      +$350.00     │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Budget Status                                       │       │
│  │ ─────────────────────────────────────────────────── │       │
│  │ Food          ████████░░   $623 / $800              │       │
│  │ Transport     █████░░░░░   $356 / $600              │       │
│  │ Entertainment ██████████   $120 / $100  ⚠ Over     │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary Cards (top row)

Three stat cards in a 3-column grid (`md:grid-cols-3`). Display-only.

| Card                | Value                               | Secondary                  |
| ------------------- | ----------------------------------- | -------------------------- |
| Net Worth           | Sum of all wallet computed balances | Δ vs previous month        |
| This Month Income   | Total income for current month      | % change vs previous month |
| This Month Expenses | Total expenses for current month    | % change vs previous month |

---

## Wallets Panel

- Lists up to 3 wallets: color dot · name · current balance.
- Total row at bottom.
- "All Wallets" → `wallets.index`.
- Empty state with "Create your first wallet" CTA when user has no wallets.

---

## Spending by Category (Donut)

- Current month, expense type only.
- Up to 5 slices; remainder grouped as "Other".
- Legend: color dot · name · % · amount.
- "View Full Report" → `reports.index`.

---

## Recent Transactions

- 10 most recent transactions across all wallets, `transacted_at DESC`.
- Row: category icon · description · category · date · amount (coloured).
- "View All" → `transactions.index`.

---

## Budget Status

- Only expense categories with a budget set.
- Progress bar turns red + ⚠ badge when over limit.
- Hidden entirely when no budgets exist.
- "Manage Budgets" link → `budgets.index`.
