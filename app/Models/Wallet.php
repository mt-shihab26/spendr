<?php

namespace App\Models;

use App\Enums\Currency;
use App\Enums\Type;
use Database\Factories\WalletFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property Currency $currency
 * @property float $initial_balance
 * @property string $color
 * @property string|null $icon
 * @property bool $is_default
 * @property int $sort_order
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property float|null $income
 * @property float|null $expense
 * @property float|null $transfers_out
 * @property float|null $transfers_in
 * @property float|null $net
 * @property float|null $balance
 */
#[Fillable(['name', 'currency', 'initial_balance', 'color', 'icon', 'is_default', 'sort_order'])]
class Wallet extends Model
{
    /** @use HasFactory<WalletFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'currency' => Currency::class,
            'initial_balance' => 'float',
            'is_default' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the wallet.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the wallet's transactions.
     *
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get transfers sent from this wallet.
     *
     * @return HasMany<Transfer, $this>
     */
    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, 'from_wallet_id');
    }

    /**
     * Get transfers received into this wallet.
     *
     * @return HasMany<Transfer, $this>
     */
    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(Transfer::class, 'to_wallet_id');
    }

    /**
     * Eager-load all four aggregate sums. Use on collection queries to avoid N+1.
     */
    public function scopeWithStats(Builder $query): void
    {
        $query
            ->withSum(['transactions as income' => fn (Builder $q) => $q->where('type', Type::Income->value)], 'amount')
            ->withSum(['transactions as expense' => fn (Builder $q) => $q->where('type', Type::Expense->value)], 'amount')
            ->withSum('outgoingTransfers as transfers_out', 'amount')
            ->withSum('incomingTransfers as transfers_in', 'amount');
    }

    /**
     * Load all aggregate stats onto this instance, then compute net and balance.
     */
    public function loadStats(): static
    {
        $this->loadSum(['transactions as income' => fn ($q) => $q->where('type', Type::Income->value)], 'amount');
        $this->loadSum(['transactions as expense' => fn ($q) => $q->where('type', Type::Expense->value)], 'amount');
        $this->loadSum(['outgoingTransfers as transfers_out'], 'amount');
        $this->loadSum(['incomingTransfers as transfers_in'], 'amount');
        $this->setAttribute('net', $this->netFlow());
        $this->setAttribute('balance', $this->currentBalance());

        return $this;
    }

    /**
     * Total income from transactions. Uses pre-loaded value when available.
     */
    public function totalIncome(): float
    {
        return array_key_exists('income', $this->getAttributes())
            ? (float) ($this->getAttributes()['income'] ?? 0)
            : (float) $this->transactions()->where('type', Type::Income->value)->sum('amount');
    }

    /**
     * Total expense from transactions. Uses pre-loaded value when available.
     */
    public function totalExpense(): float
    {
        return array_key_exists('expense', $this->getAttributes())
            ? (float) ($this->getAttributes()['expense'] ?? 0)
            : (float) $this->transactions()->where('type', Type::Expense->value)->sum('amount');
    }

    /**
     * Total amount transferred out of this wallet. Uses pre-loaded value when available.
     */
    public function totalOutgoingTransfers(): float
    {
        return array_key_exists('transfers_out', $this->getAttributes())
            ? (float) ($this->getAttributes()['transfers_out'] ?? 0)
            : (float) $this->outgoingTransfers()->sum('amount');
    }

    /**
     * Total amount transferred into this wallet. Uses pre-loaded value when available.
     */
    public function totalIncomingTransfers(): float
    {
        return array_key_exists('transfers_in', $this->getAttributes())
            ? (float) ($this->getAttributes()['transfers_in'] ?? 0)
            : (float) $this->incomingTransfers()->sum('amount');
    }

    /**
     * Net cash flow: income minus expenses.
     */
    public function netFlow(): float
    {
        return $this->totalIncome() - $this->totalExpense();
    }

    /**
     * Current balance: initial balance adjusted for all transactions and transfers.
     */
    public function currentBalance(): float
    {
        return $this->initial_balance
            + $this->totalIncome()
            - $this->totalExpense()
            - $this->totalOutgoingTransfers()
            + $this->totalIncomingTransfers();
    }
}
