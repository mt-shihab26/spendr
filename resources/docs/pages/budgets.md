# Budgets

**Route prefix:** `/budgets` — `budgets.*`
**Layout:** `AppLayout`

Monthly spending limits per expense category. Budget progress is shown on the dashboard and here in detail. Income categories do not have budgets.

---

## Budget Overview — `budgets.index`

**Route:** `GET /budgets`

```
┌──────────────────────────────────────────────────────────┐
│ Budgets                              [+ Set Budget]       │
│ Monthly spending limits by category                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Month picker: Aug 2026 ◀ ▶]                           │
│                                                          │
│  Summary                                                 │
│  Total budgeted: $2,500   Spent: $2,054   Remaining: $446│
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Category       Budget    Spent     Left    Progress│  │
│ ├────────────────────────────────────────────────────┤  │
│ │ ● Food         $800    $623.00  $177.00  ████░░ 78%│  │
│ │ ● Transport    $600    $356.00  $244.00  ███░░░ 59%│  │
│ │ ● Entertainment$100    $120.00 -$20.00  ██████ ⚠  │  │
│ │ ● Shopping     $500    $210.00  $290.00  ██░░░░ 42%│  │
│ │ ● Health       $200      $0.00  $200.00  ░░░░░░  0%│  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│  ── Categories without a budget ─────────────────────   │
│  Housing · Education · Other          [Set budgets →]   │
└──────────────────────────────────────────────────────────┘
```

### Month picker

Arrows navigate months. Defaults to current month. Changing the month recalculates spent amounts from `transactions` for that period. Budget limits are shared across all months (not month-specific).

### Budget rows

- Color dot + category name
- Budget limit (monthly cap)
- Spent amount (sum of expense transactions in selected month)
- Remaining (limit − spent; negative shown in red)
- Progress bar — turns amber at 80%, red when over 100%
- `⚠` over-budget badge

Clicking a row → opens Edit Budget modal for that category.

### Categories without a budget

Lists expense categories that have no budget set, with a "Set budgets →" link that scrolls/opens the create form.

### Empty state

When no budgets have been set: icon + "No budgets yet" + "Set your first budget" CTA.

---

## Set Budget — modal

```
┌────────────────────────────────────┐
│ Set Budget                    [✕]  │
│ ─────────────────────────────────  │
│  Category *                        │
│  [Select expense category ▾]       │
│  (only expense categories shown;   │
│   already-budgeted ones excluded)  │
│                                    │
│  Monthly Limit *                   │
│  [$ ___________________________]   │
│                                    │
│         [Cancel]  [Save Budget]    │
└────────────────────────────────────┘
```

### Fields

| Field         | Type    | Rules                                                                       |
| ------------- | ------- | --------------------------------------------------------------------------- |
| Category      | select  | required; only expense type; excludes categories that already have a budget |
| Monthly Limit | decimal | required, > 0                                                               |

---

## Edit Budget — modal

Same form as Set Budget, pre-filled. Category field is read-only.

Includes "Remove Budget" danger button.

---

## Remove Budget Confirmation

```
┌────────────────────────────────────┐
│ Remove budget for "Food"?          │
│ ─────────────────────────────────  │
│ Spending tracking will continue    │
│ but the limit will no longer apply.│
│                                    │
│         [Cancel]  [Remove]         │
└────────────────────────────────────┘
```
