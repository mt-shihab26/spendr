<?php

namespace Database\Seeders;

use App\Enums\Type;
use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            $expenseCategories = Category::where('user_id', $user->id)
                ->where('type', Type::Expense->value)
                ->get();

            $expenseCategories->each(function (Category $category) use ($user) {
                Budget::factory()
                    ->for($user)
                    ->create([
                        'category_id' => $category->id,
                    ]);
            });
        });
    }
}
