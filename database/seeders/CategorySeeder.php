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
     * @var array<int, array{name: string, color: string, icon: string}>
     */
    private array $expense = [
        ['name' => 'Food',          'color' => '#f97316', 'icon' => 'utensils'],
        ['name' => 'Transport',     'color' => '#3b82f6', 'icon' => 'car'],
        ['name' => 'Shopping',      'color' => '#a855f7', 'icon' => 'shopping-bag'],
        ['name' => 'Entertainment', 'color' => '#ec4899', 'icon' => 'film'],
        ['name' => 'Health',        'color' => '#10b981', 'icon' => 'heart-pulse'],
        ['name' => 'Housing',       'color' => '#f59e0b', 'icon' => 'home'],
        ['name' => 'Education',     'color' => '#6366f1', 'icon' => 'book-open'],
        ['name' => 'Other',         'color' => '#6b7280', 'icon' => 'ellipsis'],
    ];

    /**
     * @var array<int, array{name: string, color: string, icon: string}>
     */
    private array $income = [
        ['name' => 'Salary',     'color' => '#22c55e', 'icon' => 'briefcase'],
        ['name' => 'Freelance',  'color' => '#14b8a6', 'icon' => 'laptop'],
        ['name' => 'Investment', 'color' => '#eab308', 'icon' => 'trending-up'],
        ['name' => 'Gift',       'color' => '#f43f5e', 'icon' => 'gift'],
        ['name' => 'Miscellaneous', 'color' => '#6b7280', 'icon' => 'ellipsis'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            foreach ($this->expense as $index => $category) {
                Category::factory()
                    ->for($user)
                    ->expense()
                    ->default()
                    ->create([...$category, 'sort_order' => $index]);
            }

            foreach ($this->income as $index => $category) {
                Category::factory()
                    ->for($user)
                    ->income()
                    ->default()
                    ->create([...$category, 'sort_order' => $index]);
            }
        });
    }
}
