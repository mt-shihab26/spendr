<?php

namespace App\Models;

use App\Enums\Type;
use Database\Factories\CategoryFactory;
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
 * @property Type $type
 * @property string $color
 * @property string|null $icon
 * @property bool $is_default
 * @property int $sort_order
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $transactions_count
 * @property float|null $total_amount
 */
#[Fillable(['name', 'type', 'color', 'icon', 'is_default', 'sort_order'])]
class Category extends Model
{
    /**
     * @use HasFactory<CategoryFactory>
     */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => Type::class,
            'is_default' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the category.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category's transactions.
     *
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Eager-load transaction count and total amount. Use on collection queries to avoid N+1.
     */
    public function scopeWithStats(Builder $query): void
    {
        $query
            ->withCount('transactions')
            ->withSum('transactions as total_amount', 'amount');
    }

    /**
     * Load transaction count and total amount onto this instance.
     */
    public function loadStats(): static
    {
        $this->loadCount('transactions');
        $this->loadSum('transactions as total_amount', 'amount');

        return $this;
    }

    /**
     * Total number of transactions in this category. Uses pre-loaded value when available.
     */
    public function transactionCount(): int
    {
        return array_key_exists('transactions_count', $this->getAttributes())
            ? (int) ($this->getAttributes()['transactions_count'] ?? 0)
            : $this->transactions()->count();
    }

    /**
     * Total amount across all transactions in this category. Uses pre-loaded value when available.
     */
    public function totalAmount(): float
    {
        return array_key_exists('total_amount', $this->getAttributes())
            ? (float) ($this->getAttributes()['total_amount'] ?? 0)
            : (float) $this->transactions()->sum('amount');
    }
}
