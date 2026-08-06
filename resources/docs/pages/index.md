# UI Structure — Spendr

Wallet-type personal finance tracker. All screens live inside the `AppLayout` shell (sidebar + header) except auth pages, which use `AuthLayout`.

---

## Screen Inventory

| File                                 | Route                    | Description                                 |
| ------------------------------------ | ------------------------ | ------------------------------------------- |
| [auth.md](./auth.md)                 | `/login`, `/register`, … | Login, register, 2FA, password reset        |
| [dashboard.md](./dashboard.md)       | `/dashboard`             | Net worth, summary cards, recent activity   |
| [wallets.md](./wallets.md)           | `/wallets`               | Wallet list, detail, create, edit           |
| [transactions.md](./transactions.md) | `/transactions`          | Full transaction log, create, edit          |
| [transfers.md](./transfers.md)       | `/transfers`             | Between-wallet transfers, create, edit      |
| [categories.md](./categories.md)     | `/categories`            | Income & expense category management        |
| [budgets.md](./budgets.md)           | `/budgets`               | Monthly budget caps per expense category    |
| [reports.md](./reports.md)           | `/reports`               | Monthly trends, category breakdowns, charts |
| [settings.md](./settings.md)         | `/settings/*`            | Profile, security, appearance               |

---

## Global Shell — `AppLayout`

```
┌─────────────────────────────────────────────────────────┐
│  HEADER  [Logo/App name]           [Search]  [User ▾]   │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │   PAGE CONTENT                               │
│          │                                              │
│ Dashboard│                                              │
│ Wallets  │                                              │
│ Transact │                                              │
│ Transfers│                                              │
│ Categories                                              │
│ Budgets  │                                              │
│ Reports  │                                              │
│          │                                              │
│ ──────── │                                              │
│ Settings │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Sidebar nav items

| Label        | Icon                 | Route                   |
| ------------ | -------------------- | ----------------------- |
| Dashboard    | `layout-dashboard`   | `dashboard`             |
| Wallets      | `wallet`             | `wallets.index`         |
| Transactions | `arrow-right-left`   | `transactions.index`    |
| Transfers    | `repeat`             | `transfers.index`       |
| Categories   | `tag`                | `categories.index`      |
| Budgets      | `circle-dollar-sign` | `budgets.index`         |
| Reports      | `chart-bar`          | `reports.index`         |
| —            | —                    | —                       |
| Settings     | `settings`           | `settings.profile.edit` |

### Header user menu (dropdown)

- User avatar + name
- Settings
- Log out

---

## Quick-Add Floating Action

A `+` FAB (floating action button) visible on all app screens. Opens a modal to quickly record a transaction or transfer without navigating away from the current page.

```
                                   ┌──────────────────┐
                                   │  + Quick Add     │
              [page content]       │  ─────────────── │
                                   │  ● Transaction   │
                                   │  ● Transfer      │
                              [+]──┘                  │
                                   └──────────────────┘
```

---

## Shared Patterns

- **Empty state** — icon + headline + CTA button whenever a list has no rows.
- **Skeleton loaders** — pulsing placeholders shown while data loads (deferred props).
- **Confirm dialog** — used before any destructive action (delete wallet, category, transaction).
- **Toast notifications** — success/error feedback after form submissions.
- **Amount display** — always formatted with currency symbol and two decimal places. Income shown in green, expenses in red.
- **Date display** — `dd MMM yyyy` (e.g. `06 Aug 2026`).
