<?php

namespace App\Http\Requests\Transactions;

use App\Enums\Type;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
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
            'wallet_id' => [
                'required',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $this->user()->id),
            ],
            'category_id' => [
                'required',
                'uuid',
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id),
            ],
            'type' => ['required', Rule::enum(Type::class)],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'transacted_at' => ['required', 'date'],
            'description' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
