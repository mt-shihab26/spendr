<?php

namespace Database\Factories;

use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transfer>
 */
class TransferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $wallets = Wallet::where('user_id', $user?->id)->inRandomOrder()->limit(2)->get();

        return [
            'user_id' => $user?->id,
            'from_wallet_id' => $wallets->first()?->id,
            'to_wallet_id' => $wallets->last()?->id,
            'amount' => fake()->randomFloat(2, 1, 5000),
            'transacted_at' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s'),
            'notes' => fake()->optional(0.4)->sentence(),
        ];
    }
}
