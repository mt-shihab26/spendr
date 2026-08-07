<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name') }} &mdash; Personal Finance Tracker</title>
        <meta name="description" content="Track spending, set budgets, and reach your savings goals with Spendr.">
        <script>
            (function () {
                if (localStorage.getItem('theme') === 'dark') {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <style>
            html { background-color: oklch(1 0 0); }
            html.dark { background-color: oklch(0.148 0.004 228.8); }
        </style>
        @vite(['resources/css/app.css'])
    </head>
    <body class="bg-background font-mono text-foreground antialiased">

        <x-home.navbar />

        <main>
            <x-home.hero />
            <x-home.stats />
            <x-home.features />
            <x-home.how-it-works />
            <x-home.cta />
        </main>

        <x-home.footer />

    </body>
</html>
