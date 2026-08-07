<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    /**
     * Pre-upload a file and return its ID for later association.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,webp'],
        ]);

        $uploaded = $request->file('file');
        $uuid = (string) Str::uuid();
        $extension = $uploaded->getClientOriginalExtension();
        $directory = File::resolveDirectory($request->user()->id, null);
        $filename = File::resolveFilename($uuid, $extension);

        Storage::disk('local')->putFileAs($directory, $uploaded, $filename);

        $file = File::create([
            'id' => $uuid,
            'user_id' => $request->user()->id,
            'name' => $uploaded->getClientOriginalName(),
            'path' => $directory.'/'.$filename,
            'mime_type' => $uploaded->getMimeType() ?? 'application/octet-stream',
            'size' => $uploaded->getSize(),
        ]);

        return response()->json([
            'id' => $file->id,
            'name' => $file->name,
            'size' => $file->size,
            'mime_type' => $file->mime_type,
        ], 201);
    }

    /**
     * Attach a file to a transaction.
     */
    public function storeForTransaction(Request $request, Transaction $transaction): RedirectResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 403);

        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,pdf,webp'],
        ]);

        $uploaded = $request->file('file');
        $uuid = (string) Str::uuid();
        $extension = $uploaded->getClientOriginalExtension();
        $directory = File::resolveDirectory($request->user()->id, Transaction::class);
        $filename = File::resolveFilename($uuid, $extension);

        Storage::disk('local')->putFileAs($directory, $uploaded, $filename);

        $transaction->files()->create([
            'id' => $uuid,
            'user_id' => $request->user()->id,
            'name' => $uploaded->getClientOriginalName(),
            'path' => $directory.'/'.$filename,
            'mime_type' => $uploaded->getMimeType() ?? 'application/octet-stream',
            'size' => $uploaded->getSize(),
        ]);

        return redirect()->back()->with('success', 'File attached.');
    }

    /**
     * Serve a private file.
     */
    public function show(Request $request, File $file): StreamedResponse
    {
        abort_if($file->user_id !== $request->user()->id, 403);

        return response()->streamDownload(
            fn () => print (Storage::disk('local')->get($file->path) ?? ''),
            $file->name,
            ['Content-Type' => $file->mime_type],
        );
    }

    /**
     * Delete an attached file.
     */
    public function destroy(Request $request, File $file): RedirectResponse
    {
        abort_if($file->user_id !== $request->user()->id, 403);

        Storage::disk('local')->delete($file->path);
        $file->delete();

        return redirect()->back()->with('success', 'File removed.');
    }
}
