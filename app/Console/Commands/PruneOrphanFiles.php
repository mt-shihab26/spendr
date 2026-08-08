<?php

namespace App\Console\Commands;

use App\Models\File;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

#[Signature('app:prune-orphan-files')]
#[Description('Delete uploaded files that were never attached to a model and are older than 30 minutes')]
class PruneOrphanFiles extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $orphans = File::query()
            ->whereNull('fileable_type')
            ->whereNull('fileable_id')
            ->where('created_at', '<=', now()->subMinutes(30))
            ->get();

        $deleted = 0;

        foreach ($orphans as $file) {
            Storage::disk('local')->delete($file->path);
            $file->delete();
            $deleted++;
        }

        $this->info("Pruned {$deleted} orphan file(s).");

        return self::SUCCESS;
    }
}
