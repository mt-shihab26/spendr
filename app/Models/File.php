<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property string $id
 * @property string $user_id
 * @property class-string|null $fileable_type
 * @property string|null $fileable_id
 * @property string $name
 * @property string $path
 * @property string $mime_type
 * @property int $size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'fileable_type', 'fileable_id', 'name', 'path', 'mime_type', 'size'])]
class File extends Model
{
    use HasUuids;

    /**
     * Get the owning user.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent fileable model.
     *
     * @return MorphTo<Model, $this>
     */
    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the public URL for this file.
     */
    public function url(): string
    {
        return asset('storage/'.$this->path);
    }

    /**
     * Resolve the full storage path from the model's own attributes.
     */
    public function resolvePath(): string
    {
        return implode('/', [
            self::resolveDirectory($this->user_id, $this->fileable_type),
            self::resolveFilename($this->id, pathinfo($this->name, PATHINFO_EXTENSION)),
        ]);
    }

    /**
     * Resolve the storage directory for a file based on user and fileable type.
     * Structure: {user_id}/{model-folder}
     *
     * @param  class-string|null  $fileableType
     */
    public static function resolveDirectory(string $userId, ?string $fileableType): string
    {
        $folders = [
            Transaction::class => 'transaction-attachments',
            User::class => 'avatars',
        ];

        $folder = $folders[$fileableType ?? ''] ?? 'files';

        return implode('/', [$userId, $folder]);
    }

    /**
     * Resolve the filename from a UUID and extension.
     * Structure: {uuid}.{extension}
     */
    public static function resolveFilename(string $uuid, string $extension): string
    {
        return implode('.', [$uuid, $extension]);
    }
}
