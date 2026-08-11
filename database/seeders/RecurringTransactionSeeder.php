<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\RecurringTransaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecurringTransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            $wallets = Wallet::where('user_id', $user->id)->get();
            $categories = Category::where('user_id', $user->id)->get();

            if ($wallets->isEmpty()) {
                return;
            }

            foreach (range(1, fake()->numberBetween(3, 8)) as $ignored) {
                $wallet = $wallets->random();
                $category = $categories->isNotEmpty() ? $categories->random() : null;

                RecurringTransaction::factory()
                    ->for($user)
                    ->for($wallet)
                    ->create([
                        'category_id' => $category?->id,
                        'type' => $category?->type ?? fake()->randomElement(['income', 'expense']),
                    ]);
            }
        });
    }
}
