# Categories

**Route prefix:** `/categories` — `categories.*`
**Layout:** `AppLayout`

Income and expense categories with color and icon. The `type` field controls which list appears in the transaction form.

---

## Category List — `categories.index`

**Route:** `GET /categories`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Categories                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Categories                               [+ New Category]     │
│  Organise your income and expenses                             │
│                                                                 │
│  [Expense]   [Income]   ← tab switcher                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ≡  ● Food            $1,246 this month   [Default]      │   │
│  │ ≡  ● Transport         $356 this month   [Default]      │   │
│  │ ≡  ● Shopping          $210 this month              ⋮   │   │
│  │ ≡  ● Entertainment     $120 this month   ⚠ Over     ⋮   │   │
│  │ ≡  ● Health              $0 this month              ⋮   │   │
│  │ ≡  ● Housing             $0 this month   [Default]      │   │
│  │ ≡  ● Education           $0 this month   [Default]      │   │
│  │ ≡  ● Other              $45 this month   [Default]      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Tabs

Expense / Income. Default tab: Expense.

### List rows

- `≡` drag handle — reorders `sort_order`
- Color dot · name · month total
- `[Default]` badge — cannot be deleted; lock icon replaces ⋮
- `⚠ Over` badge — over budget this month

### Row actions (⋮)

| Action | Condition                                             |
| ------ | ----------------------------------------------------- |
| Edit   | always                                                |
| Delete | `is_default = false` AND no transactions reference it |

---

## Create Category — modal

```
┌──────────────────────────────────────┐
│ New Category                    [✕]  │
│ ─────────────────────────────────── │
│ Type *                               │
│ ┌───────────┐  ┌───────────┐        │
│ │ ● Expense │  │  Income   │        │
│ └───────────┘  └───────────┘        │
│                                      │
│ Name *                               │
│ [__________________________________] │
│                                      │
│ Color *                              │
│ [● ● ● ● ● ● ● ●]  (swatches)       │
│ or [#______] hex input               │
│                                      │
│ Icon                                 │
│ [🔍 Search icons…]                   │
│ [🛒][☕][🚌][🏠][💊][🎬][📚][⋯]    │
│                                      │
│        [Cancel]  [Create Category]   │
└──────────────────────────────────────┘
```

| Field | Rules                              |
| ----- | ---------------------------------- |
| Type  | required                           |
| Name  | required, max 100, unique per user |
| Color | required                           |
| Icon  | optional                           |

---

## Edit Category — modal

Same form, pre-filled. **Type is read-only** when the category has existing transactions. Includes "Delete" danger button when deletable.

---

## Delete with Reassign

When the category has transactions, a replacement must be chosen before deletion.

```
┌──────────────────────────────────────┐
│ Delete "Shopping"?                   │
│ ─────────────────────────────────── │
│ 3 transactions reference this        │
│ category. Reassign them to:          │
│                                      │
│ [Select replacement category ▾]      │
│                                      │
│       [Cancel]  [Reassign & Delete]  │
└──────────────────────────────────────┘
```
