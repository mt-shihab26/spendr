<?php

namespace App\Rules;

use Closure;
use DateTime;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class DateTimeFormat implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $date = DateTime::createFromFormat('Y-m-d\TH:i:s.v\Z', $value);

        if (! $date || $date->format('Y-m-d\TH:i:s.v\Z') !== $value) {
            $fail('The :attribute must be a valid ISO 8601 datetime.');
        }
    }
}
