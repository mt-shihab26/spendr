# Categories

**Route prefix:** `/categories` — `categories.*`
**Layout:** `AppLayout`

Expense and income categories with color and icon customisation. Categories are typed — each belongs to either income or expense. The type determines which list appears when recording a transaction.

---

## Category List — `categories.index`

**Route:** `GET /categories`

```
┌──────────────────────────────────────────────────────────┐
│ Categories                         [+ New Category]       │
│ Organise your income and expenses                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Expense]  [Income]   ← tab switcher                   │
│                                                          │
│ ── Expense ──────────────────────────────────────────    │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ≡  ● Food            $1,246 this month   [Default] │  │
│ │ ≡  ● Transport         $356 this month   [Default] │  │
│ │ ≡  ● Shopping          $210 this month            ⋮│  │
│ │ ≡  ● Entertainment     $120 this month   ⚠ Over   ⋮│  │
│ │ ≡  ● Health              $0 this month            ⋮│  │
│ │ ≡  ● Housing             $0 this month   [Default]│  │
│ │ ≡  ● Education           $0 this month   [Default]│  │
│ │ ≡  ● Other              $45 this month   [Default]│  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Tabs

Switching tabs filters the list to expense or income categories. Default tab is Expense.

### List rows

- `≡` drag handle — reorders `sort_order` via drag-and-drop
- Colored circle (category color)
- Category name
- Spending total for the current month (or income received for income tab)
- `[Default]` badge — default categories cannot be deleted
- `⚠ Over` badge — expense categories that have exceeded their budget this month
- `⋮` row action menu

### Row actions (⋮)

| Action | Condition                                                       |
| ------ | --------------------------------------------------------------- |
| Edit   | always                                                          |
| Delete | only when `is_default = false` AND no transactions reference it |

Default categories show a lock icon instead of `⋮`.

### Empty state (custom categories only)

Shown when the user has not created any custom categories of the selected type.

---

## Create Category — modal

```
┌─────────────────────────────────────┐
│ New Category                   [✕]  │
│ ──────────────────────────────────  │
│  Type *                             │
│  ┌──────────┐  ┌──────────┐        │
│  │ ●Expense │  │  Income  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  Name *                             │
│  [_______________________________]  │
│                                     │
│  Color *                            │
│  [● ● ● ● ● ● ● ● ●]  (swatches)   │
│  or [#______] (hex input)           │
│                                     │
│  Icon                               │
│  [Search icons…]                    │
│  [🛒][☕][🚌][🏠][💊][🎬][📚][⋯]  │
│                                     │
│         [Cancel]  [Create Category] │
└─────────────────────────────────────┘
```

### Fields

| Field | Type                      | Rules                              |
| ----- | ------------------------- | ---------------------------------- |
| Type  | toggle (Expense / Income) | required                           |
| Name  | text                      | required, max 100, unique per user |
| Color | swatch picker + hex input | required                           |
| Icon  | icon search/picker        | optional                           |

---

## Edit Category — modal

Same form as Create, pre-filled.

**Type field is read-only** when the category has existing transactions (cannot change type after use).

Includes "Delete" button when `is_default = false` and no transactions reference it.

---

## Delete Confirmation

```
┌────────────────────────────────────┐
│ Delete "Shopping"?                 │
│ ─────────────────────────────────  │
│ This category has 3 transactions.  │
│ Reassign them before deleting, or  │
│ they will be left uncategorised.   │
│                                    │
│  Reassign to: [Select category ▾]  │
│                                    │
│          [Cancel]  [Delete]        │
└────────────────────────────────────┘
```

If the category has transactions, the user must choose a replacement category before deletion is allowed.
