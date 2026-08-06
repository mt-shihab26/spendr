# Reports

**Route:** `/reports` — `reports.index`
**Layout:** `AppLayout`

Trend analysis, category breakdowns, and net cash flow charts. Read-only — no data entry here.

---

## Reports Page — `reports.index`

**Route:** `GET /reports`

```
┌──────────────────────────────────────────────────────────────┐
│ Reports                                                       │
│ Analyse your spending and income trends                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [Period: Last 6 months ▾]  [Wallet: All ▾]    [Export CSV ↓]│
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Monthly Cash Flow                                      │  │
│ │                                                        │  │
│ │  $3k ┤     ████                                       │  │
│ │  $2k ┤ ████████ ████ ████ ████                        │  │
│ │  $1k ┤─────────────────────────── (net line)          │  │
│ │   $0 ┤ ░░░░░░░░ ░░░░ ░░░░ ░░░░ ░░░░                  │  │
│ │       Mar  Apr  May  Jun  Jul  Aug                     │  │
│ │       ■ Income  ■ Expenses  — Net                     │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌──────────────────────────┐ ┌───────────────────────────┐  │
│ │ Expenses by Category     │ │ Income by Category        │  │
│ │ (selected period)        │ │ (selected period)         │  │
│ │                          │ │                           │  │
│ │  [Donut chart]           │ │  [Donut chart]            │  │
│ │                          │ │                           │  │
│ │  ● Food        38% $1.2k │ │  ● Salary    85% $6.3k   │  │
│ │  ● Transport   20%  $620 │ │  ● Freelance 12%  $900   │  │
│ │  ● Shopping    15%  $470 │ │  ● Gift       3%  $200   │  │
│ │  ● Other       27%  $860 │ │                           │  │
│ └──────────────────────────┘ └───────────────────────────┘  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Monthly Breakdown Table                                │  │
│ ├──────────┬─────────┬──────────┬────────┬──────────────┤  │
│ │ Month    │ Income  │ Expenses │  Net   │ Savings Rate │  │
│ ├──────────┼─────────┼──────────┼────────┼──────────────┤  │
│ │ Aug 2026 │ $2,100  │ $1,780   │ +$320  │ 15%          │  │
│ │ Jul 2026 │ $2,450  │ $1,920   │ +$530  │ 22%          │  │
│ │ Jun 2026 │ $2,100  │ $2,050   │  +$50  │  2%          │  │
│ │ May 2026 │ $2,100  │ $1,600   │ +$500  │ 24%          │  │
│ └──────────┴─────────┴──────────┴────────┴──────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Filter Bar

| Control    | Options                                                       | Behaviour                                    |
| ---------- | ------------------------------------------------------------- | -------------------------------------------- |
| Period     | Last 3 months / Last 6 months / Last 12 months / Custom range | Changes date window for all charts and table |
| Wallet     | All / individual wallet                                       | Scopes all data to one wallet                |
| Export CSV | —                                                             | Downloads the monthly breakdown table as CSV |

---

## Monthly Cash Flow Chart

- Grouped bar chart: income (green) and expenses (red/orange) bars side by side per month.
- Line overlay: net cash flow (income − expenses) per month.
- X-axis: months in selected period.
- Y-axis: currency amount.
- Hovering a bar shows a tooltip with exact values.

---

## Category Donut Charts

Two side-by-side donuts, one for expenses and one for income, aggregated across the selected period.

- Up to 6 slices; remainder grouped as "Other".
- Clicking a slice filters the Monthly Breakdown Table to that category.
- Legend shows: color dot · category name · percentage · total amount.

---

## Monthly Breakdown Table

| Column       | Description                         |
| ------------ | ----------------------------------- |
| Month        | `MMM YYYY`                          |
| Income       | Total income transactions           |
| Expenses     | Total expense transactions          |
| Net          | Income − Expenses (red if negative) |
| Savings Rate | Net / Income × 100, shown as %      |

Rows are sorted newest first. Clicking a month row navigates to `transactions.index` pre-filtered to that month.
