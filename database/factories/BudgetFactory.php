<?php

namespace Database\Factories;

use App\Enums\Type;
use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Budget>
 */
class BudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $category = Category::where('user_id', $user?->id)
            ->where('type', Type::Expense->value)
            ->inRandomOrder()
            ->first();

        return [
            'user_id' => $user?->id,
            'category_id' => $category?->id,
            'amount' => [
                'BDT' => fake()->randomFloat(2, 500, 50000),
                'USD' => fake()->randomFloat(2, 50, 5000),
            ],
        ];
    }
}
