<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): View
    {
        return view('pages.home');
    }

    /**
     * Display the privacy policy page.
     */
    public function privacyPolicy(): View
    {
        return view('pages.privacy-policy');
    }

    /**
     * Display the terms of service page.
     */
    public function termsOfService(): View
    {
        return view('pages.terms-of-service');
    }

    /**
     * Display the cookie policy page.
     */
    public function cookiePolicy(): View
    {
        return view('pages.cookie-policy');
    }

    /**
     * Display the refund policy page.
     */
    public function refundPolicy(): View
    {
        return view('pages.refund-policy');
    }

    /**
     * Display the contact page.
     */
    public function contact(): View
    {
        return view('pages.contact');
    }
}
