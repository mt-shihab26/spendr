<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\Type;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        $this->createDefaultCategories($user);

        return $user;
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
