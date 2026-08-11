<?php

namespace Database\Factories;

use App\Models\Goal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Goal>
 */
class GoalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $target = fake()->randomFloat(2, 1000, 50000);

        return [
            'user_id' => \App\Models\User::inRandomOrder()->first()?->id,
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'currency' => fake()->randomElement(\App\Enums\Currency::cases())->value,
            'target_amount' => $target,
            'current_amount' => fake()->randomFloat(2, 0, $target),
            'target_date' => fake()->optional()->dateTimeBetween('now', '+2 years')?->format('Y-m-d'),
            'icon' => fake()->randomElement(config('seeds.wallet_icons')),
            'color' => fake()->hexColor(),
        ];
    }
}
