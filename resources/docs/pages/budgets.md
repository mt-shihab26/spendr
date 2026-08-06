# Budgets

**Route prefix:** `/budgets` — `budgets.*`
**Layout:** `AppLayout`

Monthly spending limits per expense category. Income categories cannot have budgets.

---

## Budget Overview — `budgets.index`

**Route:** `GET /budgets`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Budgets                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Budgets                                    [+ Set Budget]     │
│  Monthly spending limits by category                           │
│                                                                 │
│  [◀  Aug 2026  ▶]                                              │
│                                                                 │
│  Total budgeted: $2,500  ·  Spent: $2,054  ·  Remaining: $446  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category        Budget    Spent      Left     Progress  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ● Food          $800    $623.00    $177.00   ████░░ 78% │   │
│  │ ● Transport     $600    $356.00    $244.00   ███░░░ 59% │   │
│  │ ● Entertainment $100    $120.00   -$20.00   ██████ ⚠   │   │
│  │ ● Shopping      $500    $210.00    $290.00   ██░░░░ 42% │   │
│  │ ● Health        $200      $0.00    $200.00   ░░░░░░  0% │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ── Categories without a budget ──────────────────────────     │
│  Housing · Education · Other                [Set budgets →]    │
└─────────────────────────────────────────────────────────────────┘
```

### Month picker

Arrows navigate months. Budget limits are global (not month-specific); only spent amounts change per month.

### Budget rows

Progress bar turns amber at 80%, red over 100%. Clicking a row opens the Edit modal.

### Empty state

Icon + "No budgets set yet" + "Set your first budget" CTA.

---

## Set Budget — modal

```
┌──────────────────────────────────────┐
│ Set Budget                      [✕]  │
│ ─────────────────────────────────── │
│ Category *                           │
│ [Select expense category ▾]          │
│ (income categories not shown;        │
│  already-budgeted ones excluded)     │
│                                      │
│ Monthly Limit *                      │
│ [$ ________________________________] │
│                                      │
│          [Cancel]  [Save Budget]     │
└──────────────────────────────────────┘
```

| Field         | Rules                                                             |
| ------------- | ----------------------------------------------------------------- |
| Category      | required; expense type only; excludes already-budgeted categories |
| Monthly Limit | required, > 0                                                     |

---

## Edit Budget — modal

Same form, pre-filled. Category field is read-only. Includes "Remove Budget" danger button.

---

## Remove Confirmation

```
┌──────────────────────────────────────┐
│ Remove budget for "Food"?            │
│ ─────────────────────────────────── │
│ Spending will still be tracked but   │
│ the monthly limit will be removed.   │
│                                      │
│          [Cancel]  [Remove]          │
└──────────────────────────────────────┘
```
