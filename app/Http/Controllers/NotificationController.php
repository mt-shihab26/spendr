<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark a single notification as read.
     */
    public function markRead(Request $request, string $id): RedirectResponse
    {
        $request->user()
            ->notifications()
            ->where('id', $id)
            ->first()
            ?->markAsRead();

        return redirect()->back();
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return redirect()->back();
    }
}
