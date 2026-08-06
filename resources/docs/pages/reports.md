# Reports

**Route:** `GET /reports` — `reports.index`
**Layout:** `AppLayout`

Trend analysis, category breakdowns, and net cash flow charts. Read-only.

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Reports                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Reports                                         [Export CSV]  │
│  Analyse your spending and income trends                        │
│                                                                 │
│  [Period: Last 6 months ▾]   [Wallet: All ▾]                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Monthly Cash Flow                                       │   │
│  │  $3k ┤      ████                                        │   │
│  │  $2k ┤  ████████  ████  ████  ████                      │   │
│  │  $1k ┤ ─────────────────────────── (net line)           │   │
│  │   $0 ┤  ░░░░░░░░  ░░░░  ░░░░  ░░░░                      │   │
│  │       Mar   Apr   May   Jun   Jul   Aug                  │   │
│  │       ■ Income   ■ Expenses   — Net                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────┐  ┌────────────────────────┐        │
│  │ Expenses by Category   │  │ Income by Category     │        │
│  │ [Donut]                │  │ [Donut]                │        │
│  │ ● Food      38% $1.2k  │  │ ● Salary    85% $6.3k  │        │
│  │ ● Transport 20%  $620  │  │ ● Freelance 12%  $900  │        │
│  │ ● Other     42%  $1.3k │  │ ● Gift       3%  $200  │        │
│  └────────────────────────┘  └────────────────────────┘        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Month     Income    Expenses    Net        Savings Rate  │   │
│  │ Aug 2026  $2,100    $1,780     +$320           15%       │   │
│  │ Jul 2026  $2,450    $1,920     +$530           22%       │   │
│  │ Jun 2026  $2,100    $2,050      +$50            2%       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Filter Bar

| Control | Options                                                       |
| ------- | ------------------------------------------------------------- |
| Period  | Last 3 months / Last 6 months / Last 12 months / Custom range |
| Wallet  | All / individual wallet                                       |

Changing either filter refreshes all three widgets.

---

## Monthly Cash Flow Chart

Grouped bar chart (income green, expenses red) with a net line overlay. Hovering shows a tooltip with exact values.

---

## Category Donut Charts

Two side-by-side donuts — expenses and income — for the selected period. Up to 6 slices; remainder as "Other". Clicking a slice pre-filters the breakdown table.

---

## Monthly Breakdown Table

| Column       | Description                         |
| ------------ | ----------------------------------- |
| Month        | `MMM YYYY`                          |
| Income       | Total income                        |
| Expenses     | Total expenses                      |
| Net          | Income − Expenses (red if negative) |
| Savings Rate | Net ÷ Income × 100                  |

Rows newest-first. Clicking a month navigates to `transactions.index` pre-filtered to that month. Export CSV downloads the full table.
