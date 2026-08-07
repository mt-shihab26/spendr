<?php

namespace App\Http\Requests\Wallets;

use App\Enums\Currency;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWalletRequest extends FormRequest
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
                'required',
                'string',
                'max:100',
                Rule::unique('wallets', 'name')->where('user_id', $this->user()->id),
            ],
            'currency' => ['required', Rule::enum(Currency::class)],
            'initial_balance' => ['nullable', 'numeric', 'min:0'],
            'color' => ['required', 'string'],
            'icon' => ['nullable', 'string'],
            'is_default' => ['boolean'],
        ];
    }
}
