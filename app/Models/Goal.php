<?php

namespace App\Models;

use Database\Factories\GoalFactory;
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
 * @property string $name
 * @property string|null $description
 * @property string $currency
 * @property float $target_amount
 * @property float $current_amount
 * @property Carbon|null $target_date
 * @property string|null $icon
 * @property string $color
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'description', 'currency', 'target_amount', 'current_amount', 'target_date', 'icon', 'color'])]
class Goal extends Model
{
    /** @use HasFactory<GoalFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_amount' => 'float',
            'current_amount' => 'float',
            'target_date' => 'date',
        ];
    }

    /**
     * Get the user that owns this goal.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the percentage progress toward the target.
     */
    public function progressPercentage(): float
    {
        if ($this->target_amount <= 0) {
            return 0.0;
        }

        return min(100.0, round(($this->current_amount / $this->target_amount) * 100, 1));
    }
}
