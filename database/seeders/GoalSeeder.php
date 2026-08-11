<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GoalSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            foreach (config('seeds.demo_goals') as $data) {
                Goal::create([
                    'user_id' => $user->id,
                    'name' => $data['name'],
                    'currency' => $data['currency'],
                    'target_amount' => $data['target_amount'],
                    'current_amount' => $data['current_amount'],
                    'color' => $data['color'],
                    'icon' => $data['icon'],
                    'target_date' => now()->addMonths($data['months_ahead'])->format('Y-m-d'),
                ]);
            }
        });
    }
}
