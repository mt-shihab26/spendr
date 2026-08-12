<?php

namespace App\Models;

use App\Enums\Frequency;
use App\Enums\Type;
use Database\Factories\RecurringTransactionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property string $wallet_id
 * @property string|null $category_id
 * @property Type $type
 * @property float $amount
 * @property string $name
 * @property string|null $notes
 * @property Frequency $frequency
 * @property Carbon $next_due_at
 * @property Carbon|null $last_run_at
 * @property bool $is_active
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['wallet_id', 'category_id', 'type', 'amount', 'name', 'notes', 'frequency', 'next_due_at', 'last_run_at', 'is_active'])]
class RecurringTransaction extends Model
{
    /** @use HasFactory<RecurringTransactionFactory> */
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
            'frequency' => Frequency::class,
            'amount' => 'float',
            'next_due_at' => 'date',
            'last_run_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns this recurring transaction.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the wallet for this recurring transaction.
     *
     * @return BelongsTo<Wallet, $this>
     */
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Get the category for this recurring transaction.
     *
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Advance next_due_at by one frequency period.
     */
    public function advanceNextDue(): void
    {
        $this->next_due_at = match ($this->frequency) {
            Frequency::Daily => $this->next_due_at->addDay(),
            Frequency::Weekly => $this->next_due_at->addWeek(),
            Frequency::Yearly => $this->next_due_at->addYear(),
            Frequency::Monthly => $this->next_due_at->addMonth(),
        };
    }
}
