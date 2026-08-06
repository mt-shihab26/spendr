# Dashboard

**Route:** `/dashboard` — `dashboard`
**Page file:** `resources/js/pages/dashboard.tsx`
**Layout:** `AppLayout`

The first screen after login. Gives a full picture of financial health at a glance: net worth, current-month cash flow, wallet balances, and recent activity.

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                          [+ Add Transaction]       │
│ Overview of your account                                     │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ SIDEBAR  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│          │ │ Net Worth   │ │ This Month  │ │ This Month  │ │
│          │ │ $4,250.00   │ │ Income      │ │ Expenses    │ │
│          │ │ ↑ +$320 vs  │ │ $2,100.00   │ │ $1,780.00   │ │
│          │ │ last month  │ │ ▲ +12%      │ │ ▼ -3%       │ │
│          │ └─────────────┘ └─────────────┘ └─────────────┘ │
│          │                                                   │
│          │ ┌──────────────────────┐ ┌──────────────────────┐ │
│          │ │ Wallets              │ │ Spending by Category │ │
│          │ │ ──────────────────── │ │ ──────────────────── │ │
│          │ │ 💳 Main Wallet $2.1k │ │ [Donut chart]        │ │
│          │ │ 💵 Cash       $350   │ │                      │ │
│          │ │ 🏦 Bank Acc   $1.8k  │ │ ● Food    35%  $623  │ │
│          │ │              ──────  │ │ ● Trans   20%  $356  │ │
│          │ │ Total        $4,250  │ │ ● Other   45%  $801  │ │
│          │ │         [All Wallets]│ │    [View Full Report]│ │
│          │ └──────────────────────┘ └──────────────────────┘ │
│          │                                                   │
│          │ ┌──────────────────────────────────────────────┐  │
│          │ │ Recent Transactions                [View All]│  │
│          │ │ ────────────────────────────────────────────  │  │
│          │ │ 🛒 Groceries       Food    05 Aug  -$45.00   │  │
│          │ │ 💼 Salary          Income  01 Aug  +$2,100   │  │
│          │ │ 🚌 Bus pass        Transp  31 Jul  -$28.00   │  │
│          │ │ 🎬 Netflix         Entert  30 Jul  -$15.99   │  │
│          │ │ 💻 Freelance job   Income  28 Jul  +$350.00  │  │
│          │ └──────────────────────────────────────────────┘  │
│          │                                                   │
│          │ ┌──────────────────────────────────────────────┐  │
│          │ │ Budget Status                                │  │
│          │ │ ────────────────────────────────────────────  │  │
│          │ │ Food          ████████░░  $623 / $800        │  │
│          │ │ Transport     █████░░░░░  $356 / $600        │  │
│          │ │ Entertainment ██████████  $120 / $100 ⚠ Over │  │
│          │ └──────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## Summary Cards (top row)

Three stat cards, each showing:

| Card                | Primary value                                | Secondary                  |
| ------------------- | -------------------------------------------- | -------------------------- |
| Net Worth           | Sum of all wallet balances                   | vs. previous month (+ / -) |
| This Month Income   | Total income transactions for current month  | % change vs previous month |
| This Month Expenses | Total expense transactions for current month | % change vs previous month |

Clicking a card does nothing — they are display-only.

---

## Wallets Panel

- Lists up to 3 wallets with name, icon/color dot, and current balance.
- Shows a total row at the bottom.
- "All Wallets" link → `wallets.index`.
- If the user has no wallets, shows an empty state with a "Create your first wallet" CTA.

---

## Spending by Category (Donut Chart)

- Filtered to current month, expense type only.
- Shows up to 5 categories; the rest are grouped as "Other".
- Each legend row shows: color dot, category name, percentage, absolute amount.
- "View Full Report" link → `reports.index`.

---

## Recent Transactions

- Last 10 transactions across all wallets, ordered by `transacted_at DESC`.
- Each row: category icon · description · category name · date · amount (green for income, red for expense).
- "View All" link → `transactions.index`.

---

## Budget Status

- Shows only expense categories that have a budget set.
- Each row: category name · progress bar · `spent / limit`.
- Bar turns red and shows a ⚠ warning when over budget.
- Hidden when no budgets have been created.
- "Manage Budgets" link at bottom → `budgets.index`.

---

## Data Sources

| Widget                | Query                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| Net Worth             | `wallets` computed balances, summed                                    |
| Month Income/Expenses | `transactions` grouped by type, current month                          |
| Wallets panel         | `wallets` with computed balance                                        |
| Category donut        | `transactions` grouped by `category_id`, current month, type = expense |
| Recent transactions   | `transactions` latest 10, eager-load category + wallet                 |
| Budget status         | `budgets` joined with current-month expense totals                     |
