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
        $formats = ['Y-m-d\TH:i', 'Y-m-d\TH:i:s', 'Y-m-d H:i:s'];

        foreach ($formats as $format) {
            $date = DateTime::createFromFormat($format, $value);

            if ($date && $date->format($format) === $value) {
                return;
            }
        }

        $fail('The :attribute must be a valid datetime.');
    }
}
