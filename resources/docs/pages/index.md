# UI Structure — Spendr

Wallet-type personal finance tracker. All authenticated screens share the `AppLayout` shell — a top header with inline nav, no sidebar. Auth pages use `AuthLayout` (centred card, no header).

---

## Screen Inventory

| File | Route | Description |
|------|-------|-------------|
| [auth.md](./auth.md) | `/login`, `/register`, … | Login, register, 2FA, password reset |
| [dashboard.md](./dashboard.md) | `/dashboard` | Net worth, summary cards, recent activity |
| [wallets.md](./wallets.md) | `/wallets` | Wallet list, detail, create, edit |
| [transactions.md](./transactions.md) | `/transactions` | Full transaction log, create, edit |
| [transfers.md](./transfers.md) | `/transfers` | Between-wallet transfers, create, edit |
| [categories.md](./categories.md) | `/categories` | Income & expense category management |
| [budgets.md](./budgets.md) | `/budgets` | Monthly budget caps per expense category |
| [reports.md](./reports.md) | `/reports` | Monthly trends, category breakdowns, charts |
| [settings.md](./settings.md) | `/settings/*` | Profile, security, appearance |

---

## Global Shell — `AppLayout`

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Wallets Transactions Transfers … [🔍] [👤 ▾]  │  ← header (h-16)
├─────────────────────────────────────────────────────────────────┤
│ Home / Wallets / Edit                                           │  ← breadcrumb bar (optional, h-12)
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      PAGE CONTENT                               │
│                    (max-w-7xl, centred)                         │
│                                                                 │
│                                                          [+]    │  ← Quick-Add FAB (fixed, bottom-right)
└─────────────────────────────────────────────────────────────────┘
```

### Header — left

| Element | Behaviour |
|---------|-----------|
| Logo | `<Link>` to `dashboard` |
| Nav items | Inline `NavigationMenu` links; active item gets a bottom-border underline |

Main nav items (desktop):

| Label | Icon | Route |
|-------|------|-------|
| Dashboard | `layout-grid` | `dashboard` |
| Wallets | `wallet` | `wallets.index` |
| Transactions | `arrow-right-left` | `transactions.index` |
| Transfers | `repeat` | `transfers.index` |
| Categories | `tag` | `categories.index` |
| Budgets | `circle-dollar-sign` | `budgets.index` |
| Reports | `chart-bar` | `reports.index` |

### Header — right

| Element | Behaviour |
|---------|-----------|
| Search `🔍` | Opens a command-palette / search overlay |
| User avatar | Dropdown: user name + email · Settings · Log out |

### Mobile (< lg breakpoint)

Nav links collapse behind a `☰` hamburger button. Tapping it opens a `Sheet` drawer from the left with all nav items. Right section (search + avatar) stays visible.

### Breadcrumb bar

Rendered below the header only when the page passes more than one breadcrumb. Shows the trail as `Home / Section / Page` with each segment linked.

---

## Quick-Add FAB

A `+` button fixed to the bottom-right corner, visible on every authenticated page.

```
                                     ┌──────────────────────┐
                                     │  + Quick Add         │
                                     │  ────────────────     │
                 [page content]      │  Transaction          │
                                     │  Transfer             │
                                [+]──┘                      │
                                     └──────────────────────┘
```

Clicking `+` opens a small menu with two options:

| Option | Navigates to |
|--------|-------------|
| Transaction | `transactions.create` |
| Transfer | `transfers.create` |

Both are full pages — no modals.

---

## Shared Patterns

- **Empty state** — icon + headline + CTA button when a list has no rows.
- **Skeleton loaders** — pulsing placeholders during data load (Inertia deferred props).
- **Confirm dialog** — inline dialog required before any destructive action (delete).
- **Toast notifications** — success/error feedback after form submissions.
- **Full-page CRUD** — all create and edit forms are full pages with their own routes and breadcrumbs.
- **Amount colour** — income always green (`+$x.xx`), expenses always red (`-$x.xx`).
- **Date format** — `dd MMM yyyy` (e.g. `06 Aug 2026`).
