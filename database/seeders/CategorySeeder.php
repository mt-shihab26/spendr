<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            foreach (config('seeds.expense_categories') as $index => $category) {
                Category::factory()
                    ->for($user)
                    ->expense()
                    ->default()
                    ->create([...$category, 'sort_order' => $index]);
            }

            foreach (config('seeds.income_categories') as $index => $category) {
                Category::factory()
                    ->for($user)
                    ->income()
                    ->default()
                    ->create([...$category, 'sort_order' => $index]);
            }
        });
    }
}
