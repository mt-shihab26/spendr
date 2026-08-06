<?php

namespace App\Http\Requests\Transfers;

use App\Rules\DateTimeFormat;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransferRequest extends FormRequest
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
            'from_wallet_id' => [
                'sometimes',
                'required',
                'uuid',
                Rule::exists('wallets', 'id')->where('user_id', $this->user()->id),
            ],
            'to_wallet_id' => [
                'sometimes',
                'required',
                'uuid',
                'different:from_wallet_id',
                Rule::exists('wallets', 'id')->where('user_id', $this->user()->id),
            ],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'transacted_at' => ['sometimes', 'required', new DateTimeFormat],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
