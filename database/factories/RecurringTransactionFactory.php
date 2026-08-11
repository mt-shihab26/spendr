<?php

namespace Database\Factories;

use App\Models\RecurringTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RecurringTransaction>
 */
class RecurringTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(\App\Enums\Type::cases())->value;

        return [
            'user_id' => \App\Models\User::inRandomOrder()->first()?->id,
            'wallet_id' => \App\Models\Wallet::inRandomOrder()->first()?->id,
            'category_id' => null,
            'type' => $type,
            'amount' => fake()->randomFloat(2, 10, 5000),
            'description' => fake()->words(3, true),
            'notes' => fake()->optional()->sentence(),
            'frequency' => fake()->randomElement(['daily', 'weekly', 'monthly', 'yearly']),
            'next_due_at' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'last_run_at' => null,
            'is_active' => true,
        ];
    }
}
