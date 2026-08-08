@props (['title', 'description'])

<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class (['dark' => ($appearance ?? 'system') == 'dark'])
>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}" />
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia(
                    '(prefers-color-scheme: dark)',
                ).matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>
    <style>
        html {
            background-color: oklch(1 0 0);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>
    @vite (['resources/css/app.css'])
</head>
<body class="bg-background font-mono text-foreground antialiased">
    <x-screens.site.navbar />
    <main>{{ $slot }}</main>
    <x-screens.site.footer />
    <script>
        (function () {
            const navLinks = document.querySelectorAll(
                '.nav-link[data-section]',
            );
            const sections = ['features', 'guide', 'pricing']
                .map(function (id) {
                    return document.getElementById(id);
                })
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
