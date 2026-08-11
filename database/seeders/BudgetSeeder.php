<?php

namespace Database\Seeders;

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
            foreach (config('seeds.demo_budgets') as $categoryName => $limits) {
                $category = Category::where('user_id', $user->id)->where('name', $categoryName)->first();
                if (! $category) {
                    continue;
                }

                Budget::create([
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'amount' => array_filter($limits, fn ($v) => $v !== null),
                ]);
            }
        });
    }
}
