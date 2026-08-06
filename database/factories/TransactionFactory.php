<?php

namespace Database\Factories;

use App\Enums\Type;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(Type::cases());
        $user = User::inRandomOrder()->first();

        return [
            'user_id' => $user?->id,
            'wallet_id' => Wallet::where('user_id', $user?->id)->inRandomOrder()->first()?->id,
            'category_id' => Category::where('user_id', $user?->id)->where('type', $type->value)->inRandomOrder()->first()?->id,
            'type' => $type->value,
            'amount' => fake()->randomFloat(2, 1, 5000),
            'transacted_at' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s'),
            'description' => fake()->sentence(4),
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Set the transaction type to income.
     */
    public function income(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Type::Income->value,
        ]);
    }

    /**
     * Set the transaction type to expense.
     */
    public function expense(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Type::Expense->value,
        ]);
    }
}
