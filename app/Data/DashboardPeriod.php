<?php

namespace App\Data;

class DashboardPeriod
{
    /**
     * Create a new period instance.
     */
    public function __construct(
        public readonly int $year,
        public readonly int $month,
        public readonly int $prevYear,
        public readonly int $prevMonth,
    ) {}

    /**
     * Build a period from the current date and previous month.
     */
    public static function fromNow(): self
    {
        $now = now();

        $prev = $now->copy()->subMonth();

        return new self(
            year: (int) $now->year,
            month: (int) $now->month,
            prevYear: (int) $prev->year,
            prevMonth: (int) $prev->month);
    }
}
