# Database Structure — Spendr

Personal wallet tracker with income & expense management, category management, monthly summaries, and aggregate breakdowns. All data is isolated per user.

---

## Tables

### `users` _(existing)_

Managed by Laravel Fortify. Each user owns their wallets, categories, and transactions.

| Column                      | Type         | Constraints        |
|-----------------------------|--------------|--------------------|
| `id`                        | bigint       | PK, auto-increment |
| `name`                      | varchar(255) | not null           |
| `email`                     | varchar(255) | unique, not null   |
| `email_verified_at`         | timestamp    | nullable           |
| `password`                  | varchar(255) | not null           |
| `two_factor_secret`         | text         | nullable           |
| `two_factor_recovery_codes` | text         | nullable           |
| `two_factor_confirmed_at`   | timestamp    | nullable           |
| `remember_token`            | varchar(100) | nullable           |
| `created_at`                | timestamp    | nullable           |
| `updated_at`                | timestamp    | nullable           |

---

### `wallets`

A user can have multiple wallets (e.g. cash, bank account, credit card). Transactions are always attached to a wallet, and the wallet balance is derived from its initial balance plus all recorded transactions.

| Column            | Type           | Constraints                     |
|-------------------|----------------|---------------------------------|
| `id`              | bigint         | PK, auto-increment              |
| `user_id`         | bigint         | FK → `users.id`, cascade delete |
| `name`            | varchar(100)   | not null                        |
| `currency`        | varchar(3)     | not null, default `USD`         |
| `initial_balance` | decimal(15,2)  | not null, default `0.00`        |
| `color`           | varchar(7)     | not null, default `#6366f1`     |
| `icon`            | varchar(50)    | nullable                        |
| `is_default`      | boolean        | not null, default `false`       |
| `sort_order`      | unsignedInt    | not null, default `0`           |
| `created_at`      | timestamp      | nullable                        |
| `updated_at`      | timestamp      | nullable                        |

**Indexes:**
- `wallets_user_id_index` on `(user_id)`
- `wallets_user_id_name_unique` unique on `(user_id, name)`

**Notes:**
- Current balance is never stored; it is always computed: `initial_balance + SUM(income) - SUM(expenses)` for that wallet.
- Only one wallet per user may have `is_default = true`. Enforced at the application layer.

---

### `categories`

User-defined categories, each scoped to either income or expense so the UI can present the right list when recording a transaction.

| Column       | Type                         | Constraints                     |
|--------------|------------------------------|---------------------------------|
| `id`         | bigint                       | PK, auto-increment              |
| `user_id`    | bigint                       | FK → `users.id`, cascade delete |
| `name`       | varchar(100)                 | not null                        |
| `type`       | enum(`income`, `expense`)    | not null                        |
| `color`      | varchar(7)                   | not null, default `#6366f1`     |
| `icon`       | varchar(50)                  | nullable                        |
| `is_default` | boolean                      | not null, default `false`       |
| `sort_order` | unsignedInt                  | not null, default `0`           |
| `created_at` | timestamp                    | nullable                        |
| `updated_at` | timestamp                    | nullable                        |

**Indexes:**
- `categories_user_id_index` on `(user_id)`
- `categories_user_id_type_index` on `(user_id, type)` — fast lookup when filtering the category picker by type
- `categories_user_id_name_unique` unique on `(user_id, name)`

**Notes:**
- `is_default` marks system-seeded categories created on registration. Users may rename but not delete defaults.
- A category's `type` cannot be changed after transactions reference it.

---

### `transactions`

Core table. One row per income or expense entry. Replaces a pure `expenses` table.

| Column          | Type                      | Constraints                              |
|-----------------|---------------------------|------------------------------------------|
| `id`            | bigint                    | PK, auto-increment                       |
| `user_id`       | bigint                    | FK → `users.id`, cascade delete          |
| `wallet_id`     | bigint                    | FK → `wallets.id`, restrict delete       |
| `category_id`   | bigint                    | FK → `categories.id`, restrict delete    |
| `type`          | enum(`income`, `expense`) | not null                                 |
| `amount`        | decimal(15,2)             | not null, unsigned (always positive)     |
| `transacted_at` | date                      | not null                                 |
| `description`   | varchar(255)              | not null                                 |
| `notes`         | text                      | nullable                                 |
| `created_at`    | timestamp                 | nullable                                 |
| `updated_at`    | timestamp                 | nullable                                 |

**Indexes:**
- `transactions_user_id_index` on `(user_id)`
- `transactions_user_id_transacted_at_index` on `(user_id, transacted_at)` — month/date range filtering
- `transactions_user_id_type_index` on `(user_id, type)` — income vs expense splits
- `transactions_user_id_category_id_index` on `(user_id, category_id)` — per-category aggregation
- `transactions_wallet_id_index` on `(wallet_id)`

**Notes:**
- `type` must match `category.type` — enforced at the application layer before insert/update.
- `amount` is always stored as a positive number. The `type` column determines whether it adds to or subtracts from the wallet balance.
- `wallet_id` and `category_id` use `restrict` on delete; the UI must prompt to reassign before deletion.

---

### `transfers`

Moves funds between two wallets owned by the same user. Recorded separately from transactions to avoid polluting income/expense totals.

| Column          | Type          | Constraints                             |
|-----------------|---------------|-----------------------------------------|
| `id`            | bigint        | PK, auto-increment                      |
| `user_id`       | bigint        | FK → `users.id`, cascade delete         |
| `from_wallet_id`| bigint        | FK → `wallets.id`, restrict delete      |
| `to_wallet_id`  | bigint        | FK → `wallets.id`, restrict delete      |
| `amount`        | decimal(15,2) | not null, unsigned                      |
| `transacted_at` | date          | not null                                |
| `notes`         | text          | nullable                                |
| `created_at`    | timestamp     | nullable                                |
| `updated_at`    | timestamp     | nullable                                |

**Indexes:**
- `transfers_user_id_index` on `(user_id)`
- `transfers_user_id_transacted_at_index` on `(user_id, transacted_at)`
- `transfers_from_wallet_id_index` on `(from_wallet_id)`
- `transfers_to_wallet_id_index` on `(to_wallet_id)`

**Constraint:** `from_wallet_id ≠ to_wallet_id` — enforced at application layer.

---

### `budgets`

Monthly spending cap per expense category. Income categories do not have budgets.

| Column        | Type          | Constraints                              |
|---------------|---------------|------------------------------------------|
| `id`          | bigint        | PK, auto-increment                       |
| `user_id`     | bigint        | FK → `users.id`, cascade delete          |
| `category_id` | bigint        | FK → `categories.id`, cascade delete     |
| `amount`      | decimal(15,2) | not null, unsigned                       |
| `created_at`  | timestamp     | nullable                                 |
| `updated_at`  | timestamp     | nullable                                 |

**Indexes:**
- `budgets_user_id_category_id_unique` unique on `(user_id, category_id)` — one budget per category per user

**Note:** `category_id` must reference a category with `type = expense`. Enforced at application layer.

---

## Relationships

```
users      1──< wallets       (user_id)
users      1──< categories    (user_id)
users      1──< transactions  (user_id)
users      1──< transfers     (user_id)
users      1──< budgets       (user_id)

wallets    1──< transactions  (wallet_id)
wallets    1──< transfers     (from_wallet_id)
wallets    1──< transfers     (to_wallet_id)

categories 1──< transactions  (category_id)
categories 1──1 budgets       (category_id, scoped by user)
```

---

## Computed / Aggregate Views

Not stored — derived at query time.

### Wallet Balance

```sql
SELECT
    w.id,
    w.name,
    w.currency,
    w.initial_balance
        + COALESCE(SUM(CASE WHEN t.type = 'income'  THEN t.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)
        - COALESCE(out_transfers.total, 0)
        + COALESCE(in_transfers.total, 0)  AS current_balance
FROM wallets w
LEFT JOIN transactions t         ON t.wallet_id = w.id
LEFT JOIN (
    SELECT from_wallet_id, SUM(amount) AS total FROM transfers GROUP BY from_wallet_id
) out_transfers                  ON out_transfers.from_wallet_id = w.id
LEFT JOIN (
    SELECT to_wallet_id,   SUM(amount) AS total FROM transfers GROUP BY to_wallet_id
) in_transfers                   ON in_transfers.to_wallet_id = w.id
WHERE w.user_id = :user_id
GROUP BY w.id;
```

### Monthly Summary (net cash flow)

```sql
SELECT
    strftime('%Y', transacted_at)  AS year,
    strftime('%m', transacted_at)  AS month,
    SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END) AS net
FROM transactions
WHERE user_id = :user_id
  AND transacted_at BETWEEN :start AND :end
GROUP BY year, month
ORDER BY year DESC, month DESC;
```

### Category Breakdown (for a period)

```sql
SELECT
    c.id,
    c.name,
    c.type,
    c.color,
    c.icon,
    SUM(t.amount) AS total,
    COUNT(t.id)   AS count
FROM transactions t
JOIN categories c ON c.id = t.category_id
WHERE t.user_id = :user_id
  AND t.transacted_at BETWEEN :start AND :end
  AND t.type = :type          -- 'income' or 'expense'
GROUP BY c.id, c.name, c.type, c.color, c.icon
ORDER BY total DESC;
```

### Dashboard Overview

Assembled from the above, plus:
- Net worth: sum of all wallet current balances
- Recent transactions: `ORDER BY transacted_at DESC LIMIT 10`
- Budget utilisation: joins `budgets` with current-month category totals

---

## Filtering

All list and aggregate endpoints accept these optional query parameters:

| Parameter       | Applied to                    | Notes                                       |
|-----------------|-------------------------------|---------------------------------------------|
| `wallet_id`     | `transactions`, `transfers`   | Single wallet filter                        |
| `category_id`   | `transactions`                | Single category filter                      |
| `type`          | `transactions`                | `income` or `expense`                       |
| `date_from`     | `transacted_at`               | Inclusive lower bound (`Y-m-d`)             |
| `date_to`       | `transacted_at`               | Inclusive upper bound (`Y-m-d`)             |
| `month`         | `transacted_at`               | Shorthand for a full month (`Y-m`)          |
| `search`        | `transactions.description`    | `LIKE %term%`                               |

All filters are applied after `user_id = auth()->id()`.

---

## Per-User Data Isolation

Every table carries a `user_id` foreign key. Models (`Wallet`, `Category`, `Transaction`, `Transfer`, `Budget`) use a shared `BelongsToUser` global scope so all queries are automatically scoped to the authenticated user. Raw queries bypassing the ORM must apply the `user_id` condition manually.

---

## Seeding Defaults

On registration, the following categories and one default wallet are created for each user.

### Default Wallet

| Name        | Currency | Initial Balance |
|-------------|----------|-----------------|
| Main Wallet | USD      | 0.00            |

### Default Categories — Expense

| Name          | Color     | Icon           |
|---------------|-----------|----------------|
| Food          | `#f97316` | `utensils`     |
| Transport     | `#3b82f6` | `car`          |
| Shopping      | `#a855f7` | `shopping-bag` |
| Entertainment | `#ec4899` | `film`         |
| Health        | `#10b981` | `heart-pulse`  |
| Housing       | `#f59e0b` | `home`         |
| Education     | `#6366f1` | `book-open`    |
| Other         | `#6b7280` | `ellipsis`     |

### Default Categories — Income

| Name       | Color     | Icon        |
|------------|-----------|-------------|
| Salary     | `#22c55e` | `briefcase` |
| Freelance  | `#14b8a6` | `laptop`    |
| Investment | `#eab308` | `trending-up` |
| Gift       | `#f43f5e` | `gift`      |
| Other      | `#6b7280` | `ellipsis`  |

Seeded via `WalletSeeder` and `CategorySeeder` invoked from `RegisteredUserListener`.
