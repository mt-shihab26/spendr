<?php

namespace Database\Factories;

use App\Enums\Currency;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Wallet>
 */
class WalletFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id,
            'name' => fake()->unique()->words(2, true),
            'currency' => fake()->randomElement(Currency::cases())->value,
            'initial_balance' => fake()->randomFloat(2, 0, 10000),
            'color' => fake()->hexColor(),
            'icon' => fake()->randomElement(config('seeds.wallet_icons')),
            'is_default' => false,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Set the wallet as the user's default wallet.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
