<?php

namespace App\Http\Controllers;

class WellKnownController extends Controller
{
    /**
     * Show the well known passkey endpoints.
     */
    public function passkeyEndpoints()
    {
        return response()->json([
            'enroll' => route('settings.security.edit'),
            'manage' => route('settings.security.edit'),
        ]);
    }
}
