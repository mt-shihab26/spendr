<?php

namespace App\Actions\Auth;

use App\Concerns\ValidationRules;
use App\Enums\Currency;
use App\Enums\Type;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use ValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'password' => $this->passwordRules(),
        ];

        Validator::make($input, $rules)->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        $this->createDefaultWallet($user);
        $this->createDefaultCategories($user);

        return $user;
    }

    /**
     * Create the default "Money Bag" wallet for a new user.
     */
    private function createDefaultWallet(User $user): void
    {
        $user->wallets()->create([
            'name' => 'Money Bagg',
            'currency' => Currency::BDT,
            'initial_balance' => 0,
            'color' => '#22c55e',
            'icon' => 'Wallet',
            'is_default' => true,
            'sort_order' => 0,
        ]);
    }

    /**
     * Seed the default expense and income categories for a new user.
     */
    private function createDefaultCategories(User $user): void
    {
        foreach (config('seeds.expense_categories') as $index => $category) {
            $user->categories()->create([
                ...$category,
                'type' => Type::Expense,
                'is_default' => true,
                'sort_order' => $index,
            ]);
        }

        foreach (config('seeds.income_categories') as $index => $category) {
            $user->categories()->create([
                ...$category,
                'type' => Type::Income,
                'is_default' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
