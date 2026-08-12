<?php

use Illuminate\Support\Facades\Http;

test('returns a successful response', function () {
    Http::fake(['https://api.ipify.org' => Http::response('1.2.3.4')]);

    $response = $this->get(route('home'));

    $response->assertOk();
});
