<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            Wallet::factory()
                ->for($user)
                ->default()
                ->create(['name' => 'Cash']);

            Wallet::factory(3)
                ->for($user)
                ->create();
        });
    }
}
