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
│  │ ● Food          $800    $623.00    $177.00   ████░░ 78% →│   │
│  │ ● Transport     $600    $356.00    $244.00   ███░░░ 59% →│   │
│  │ ● Entertainment $100    $120.00   -$20.00   ██████ ⚠  →│   │
│  │ ● Shopping      $500    $210.00    $290.00   ██░░░░ 42% →│   │
│  │ ● Health        $200      $0.00    $200.00   ░░░░░░  0% →│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ── Categories without a budget ──────────────────────────     │
│  Housing · Education · Other                [Set budgets →]    │
└─────────────────────────────────────────────────────────────────┘
```

### Month picker

Arrows navigate months. Budget limits are global (not month-specific); only spent amounts change per month.

### Budget rows

Progress bar turns amber at 80%, red over 100%. `→` chevron navigates to `budgets.edit`.

"[+ Set Budget]" → `budgets.create`. "Set budgets →" link → `budgets.create`.

### Empty state

Icon + "No budgets set yet" + "Set your first budget" → `budgets.create`.

---

## Set Budget — `budgets.create`

**Route:** `GET /budgets/create`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Budgets / Set Budget                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Set Budget                                                     │
│  Define a monthly spending limit for a category                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category *                                              │   │
│  │ [Select expense category ▾]                             │   │
│  │ (income categories not shown;                           │   │
│  │  already-budgeted ones excluded)                        │   │
│  │                                                         │   │
│  │ Monthly Limit *                                         │   │
│  │ [$ _________________________________________________]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                              [Cancel]  [Save Budget]           │
└─────────────────────────────────────────────────────────────────┘
```

| Field         | Rules                                                             |
| ------------- | ----------------------------------------------------------------- |
| Category      | required; expense type only; excludes already-budgeted categories |
| Monthly Limit | required, > 0                                                     |

On success → redirects to `budgets.index`. Cancel → `budgets.index`.

---

## Edit Budget — `budgets.edit`

**Route:** `GET /budgets/{budget}/edit`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Budgets / Food / Edit                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edit Budget                                                    │
│  Update the monthly limit for Food                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category                                                │   │
│  │ Food  (read-only)                                       │   │
│  │                                                         │   │
│  │ Monthly Limit *                                         │   │
│  │ [$ 800.00__________________________________________]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Remove Budget]                [Cancel]  [Save Changes]       │
│   ↑ danger, far left                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Remove Confirmation — inline dialog

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
