<?php

namespace App\Http\Requests\Budgets;

use App\Enums\Type;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBudgetRequest extends FormRequest
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
            'category_id' => [
                'required',
                'uuid',
                Rule::exists('categories', 'id')->where('user_id', $this->user()->id)->where('type', Type::Expense->value),
                Rule::unique('budgets')->where('user_id', $this->user()->id),
            ],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
