<?php

namespace App\Http\Requests\Wallets;

use App\Enums\Currency;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWalletRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('wallets', 'name')
                    ->where('user_id', $this->user()->id)
                    ->ignore($this->wallet->id),
            ],
            'currency' => ['sometimes', 'required', Rule::enum(Currency::class)],
            'initial_balance' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'color' => ['sometimes', 'required', 'string'],
            'icon' => ['sometimes', 'nullable', 'string'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }
}
