<?php

namespace App\Http\Requests\RecurringTransactions;

use App\Enums\Frequency;
use App\Enums\Type;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRecurringTransactionRequest extends FormRequest
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
            'wallet_id' => ['required', 'uuid', Rule::exists('wallets', 'id')->where('user_id', $this->user()->id)],
            'category_id' => ['nullable', 'uuid', Rule::exists('categories', 'id')->where('user_id', $this->user()->id)],
            'type' => ['required', 'string', Rule::in(array_column(Type::cases(), 'value'))],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'frequency' => ['required', 'string', Rule::in(array_column(Frequency::cases(), 'value'))],
            'next_due_at' => ['required', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
