<?php

namespace Database\Seeders;

use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransferSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            $wallets = Wallet::where('user_id', $user->id)->get();

            if ($wallets->count() < 2) {
                return;
            }

            foreach (range(1, 20) as $ignored) {
                $shuffled = $wallets->shuffle();
                $fromWallet = $shuffled->first();
                $toWallet = $shuffled->last();

                Transfer::factory()
                    ->for($user)
                    ->create([
                        'from_wallet_id' => $fromWallet->id,
                        'to_wallet_id' => $toWallet->id,
                    ]);
            }
        });
    }
}
