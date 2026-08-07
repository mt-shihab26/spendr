<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class WellKnownController extends Controller
{
    /**
     * Show the well known passkey endpoints.
     */
    public function passkeyEndpoints(): JsonResponse
    {
        return response()->json([
            'enroll' => route('settings.security.edit'),
            'manage' => route('settings.security.edit'),
        ]);
    }
}
