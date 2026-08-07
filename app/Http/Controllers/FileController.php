<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FileController extends Controller
{
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
        $path = $uploaded->store("attachments/{$request->user()->id}", 'private');

        $transaction->files()->create([
            'user_id' => $request->user()->id,
            'name' => $uploaded->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $uploaded->getMimeType() ?? 'application/octet-stream',
            'size' => $uploaded->getSize(),
        ]);

        return redirect()->back()->with('success', 'File attached.');
    }

    /**
     * Serve a private file.
     */
    public function show(Request $request, File $file): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        abort_if($file->user_id !== $request->user()->id, 403);

        return \Illuminate\Support\Facades\Storage::disk('private')->streamDownload(
            fn () => print(\Illuminate\Support\Facades\Storage::disk('private')->get($file->path) ?? ''),
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

        \Illuminate\Support\Facades\Storage::disk('private')->delete($file->path);
        $file->delete();

        return redirect()->back()->with('success', 'File removed.');
    }
}
