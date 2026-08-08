<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class NotificationsUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'notify_budget_alerts' => ['required', 'boolean'],
            'notify_budget_alert_threshold' => ['required', 'integer', 'min:1', 'max:100'],
            'notify_goal_milestones' => ['required', 'boolean'],
            'notify_recurring_reminders' => ['required', 'boolean'],
        ];
    }
}
