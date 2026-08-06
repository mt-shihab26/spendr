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
│  │ ≡  ● Shopping          $210 this month              →   │   │
│  │ ≡  ● Entertainment     $120 this month   ⚠ Over     →   │   │
│  │ ≡  ● Health              $0 this month              →   │   │
│  │ ≡  ● Housing             $0 this month   [Default]      │   │
│  │ ≡  ● Education           $0 this month   [Default]      │   │
│  │ ≡  ● Other              $45 this month   [Default]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                          [+]   │
└─────────────────────────────────────────────────────────────────┘
```

### Tabs

Expense / Income. Default tab: Expense.

### List rows

- `≡` drag handle — reorders `sort_order`
- Color dot · name · month total
- `[Default]` badge — cannot be deleted; no `→` chevron
- `⚠ Over` badge — over budget this month
- `→` chevron — navigates to `categories.edit`

"[+ New Category]" → `categories.create`.

---

## Create Category — `categories.create`

**Route:** `GET /categories/create`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Categories / New Category                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Category                                                   │
│  Add an income or expense category                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type *                                                  │   │
│  │ ┌─────────────┐  ┌─────────────┐                       │   │
│  │ │  ● Expense  │  │   Income    │                       │   │
│  │ └─────────────┘  └─────────────┘                       │   │
│  │                                                         │   │
│  │ Name *                                                  │   │
│  │ [___________________________________________________]   │   │
│  │                                                         │   │
│  │ Color *                                                 │   │
│  │ [● ● ● ● ● ● ● ●]  (swatches)                         │   │
│  │ or [#______] hex input                                  │   │
│  │                                                         │   │
│  │ Icon                                                    │   │
│  │ [🔍 Search icons…]                                      │   │
│  │ [🛒][☕][🚌][🏠][💊][🎬][📚][⋯]                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                           [Cancel]  [Create Category]          │
└─────────────────────────────────────────────────────────────────┘
```

| Field | Rules |
|-------|-------|
| Type | required |
| Name | required, max 100, unique per user |
| Color | required |
| Icon | optional |

On success → redirects to `categories.index`. Cancel → `categories.index`.

---

## Edit Category — `categories.edit`

**Route:** `GET /categories/{category}/edit`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions …          [🔍] [👤 ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ Home / Categories / Shopping / Edit                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edit Category                                                  │
│  Update this category                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ (same fields as Create, pre-filled)                     │   │
│  │ Type is read-only when transactions exist               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Delete]                       [Cancel]  [Save Changes]       │
│   ↑ danger, far left; hidden for default categories            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Delete with Reassign — inline dialog

When the category has transactions, a replacement must be chosen first.

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
