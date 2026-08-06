<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            $wallets = Wallet::where('user_id', $user->id)->get();
            $incomeCategories = Category::where('user_id', $user->id)->where('type', 'income')->get();
            $expenseCategories = Category::where('user_id', $user->id)->where('type', 'expense')->get();

            if ($wallets->isEmpty() || $incomeCategories->isEmpty() || $expenseCategories->isEmpty()) {
                return;
            }

            foreach (range(1, 30) as $ignored) {
                $isIncome = fake()->boolean(40);
                $category = $isIncome
                    ? $incomeCategories->random()
                    : $expenseCategories->random();

                Transaction::factory()
                    ->for($user)
                    ->for($wallets->random())
                    ->for($category)
                    ->create(['type' => $category->type]);
            }
        });
    }
}
