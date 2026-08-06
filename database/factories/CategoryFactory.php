<?php

namespace Database\Factories;

use App\Enums\Type;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
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
            'name' => fake()->unique()->word(),
            'type' => fake()->randomElement(Type::cases())->value,
            'color' => fake()->hexColor(),
            'icon' => fake()->randomElement(config('seeds.category_icons')),
            'is_default' => false,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Set the category type to income.
     */
    public function income(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Type::Income->value,
        ]);
    }

    /**
     * Set the category type to expense.
     */
    public function expense(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Type::Expense->value,
        ]);
    }

    /**
     * Mark the category as a system default.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
