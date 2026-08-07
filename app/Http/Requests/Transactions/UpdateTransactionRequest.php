<?php

namespace App\Http\Requests\Transactions;

use App\Enums\Type;
use App\Rules\DateTimeFormat;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
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
                'sometimes',
                'required',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $this->user()->id),
            ],
            'category_id' => [
                'sometimes',
                'required',
                'uuid',
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id),
            ],
            'type' => ['sometimes', 'required', Rule::enum(Type::class)],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'transacted_at' => ['sometimes', 'required', new DateTimeFormat],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
