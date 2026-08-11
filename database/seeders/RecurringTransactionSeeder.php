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
            foreach (config('seeds.demo_recurring') as $data) {
                $wallet = Wallet::where('user_id', $user->id)->where('name', $data['wallet'])->first();
                $category = Category::where('user_id', $user->id)->where('name', $data['category'])->first();

                if (! $wallet || ! $category) {
                    continue;
                }

                RecurringTransaction::create([
                    'user_id'     => $user->id,
                    'wallet_id'   => $wallet->id,
                    'category_id' => $category->id,
                    'type'        => $data['type'],
                    'amount'      => $data['amount'],
                    'description' => $data['description'],
                    'frequency'   => $data['frequency'],
                    'next_due_at' => now()->startOfMonth()->addMonth()->addDays($data['due_day'] - 1)->format('Y-m-d'),
                    'is_active'   => true,
                ]);
            }
        });
    }
}
