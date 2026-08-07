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
            <x-home.pricing />
            <x-home.cta />
        </main>
        <x-home.footer />

        <script>
            (function () {
                const navLinks = document.querySelectorAll('.nav-link[data-section]');
                const sections = ['features', 'guide', 'pricing']
                    .map(function (id) { return document.getElementById(id); })
                    .filter(Boolean);

                function setActive(id) {
                    navLinks.forEach(function (link) {
                        var isActive = link.dataset.section === id;
                        link.classList.toggle('text-foreground', isActive);
                        link.classList.toggle('font-medium', isActive);
                        link.classList.toggle('text-muted-foreground', !isActive);
                    });
                }

                function onScroll() {
                    var midY = window.scrollY + window.innerHeight / 2;
                    var current = null;
                    sections.forEach(function (section) {
                        if (section.offsetTop <= midY) {
                            current = section.id;
                        }
                    });
                    setActive(current);
                }

                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
            })();
        </script>
    </body>
</html>
