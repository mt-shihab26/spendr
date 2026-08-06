<?php

namespace App\Http\Requests\Categories;

use App\Enums\Type;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
                Rule::unique('categories', 'name')->where('user_id', $this->user()->id),
            ],
            'type' => ['required', Rule::enum(Type::class)],
            'color' => ['required', 'string', 'max:7'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_default' => ['boolean'],
        ];
    }
}
