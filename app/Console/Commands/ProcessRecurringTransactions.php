<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:process-recurring-transactions')]
#[Description('Create transactions for all due recurring transaction rules')]
class ProcessRecurringTransactions extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $due = RecurringTransaction::query()
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->where('next_due_at', '<=', now()->toDateString())
            ->with('user')
            ->get();

        $processed = 0;

        foreach ($due as $recurring) {
            if (! $recurring->user) {
                continue;
            }

            DB::transaction(function () use ($recurring, &$processed) {
                $recurring->user->transactions()->create([
                    'wallet_id' => $recurring->wallet_id,
                    'category_id' => $recurring->category_id,
                    'type' => $recurring->type->value,
                    'amount' => $recurring->amount,
                    'description' => $recurring->description,
                    'notes' => $recurring->notes,
                    'transacted_at' => now(),
                ]);

                $recurring->advanceNextDue();
                $recurring->last_run_at = now();
                $recurring->save();

                $processed++;
            });
        }

        $this->info("Processed {$processed} recurring transaction(s).");

        return self::SUCCESS;
    }
}
