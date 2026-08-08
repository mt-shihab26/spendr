<?php
$navLinks = [
    ['label' => 'Features', 'href' => '#features', 'section' => 'features'],
    ['label' => 'Guide',    'href' => '#guide',    'section' => 'guide'],
    ['label' => 'Pricing',  'href' => '#pricing',  'section' => 'pricing'],
];
?>

<nav
    class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
>
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-9">
            <a class="flex items-center gap-2" href="{{ route('home') }}">
                <x-icons.app-logo />
            </a>
            <div class="hidden items-center gap-8 md:flex">
                @foreach ($navLinks as $link)
                    <a
                        class="nav-link text-sm text-muted-foreground transition-colors hover:text-foreground"
                        href="{{ $link['href'] }}"
                        data-section="{{ $link['section'] }}"
                    >
                        {{ $link['label'] }}
                    </a>
                @endforeach
            </div>
        </div>
        <div class="flex items-center gap-3">
            @auth
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <x-ui.button variant="outline" type="submit">
                        Sign out
                        <x-icons.logout class="size-4" />
                    </x-ui.button>
                </form>
                <x-ui.button href="{{ route('dashboard') }}">
                    Dashboard
                    <x-icons.squares-2x2 class="size-4" />
                </x-ui.button>
            @else
                <x-ui.button variant="outline" href="{{ route('login') }}">
                    Sign in
                    <x-icons.login class="size-4" />
                </x-ui.button>
                <x-ui.button href="{{ route('register') }}">
                    Sign up
                    <x-icons.arrow-right class="size-4" />
                </x-ui.button>
            @endauth
            <x-ui.button
                id="theme-toggle"
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                class="text-muted-foreground"
            >
                <x-icons.sun id="icon-sun" class="hidden size-4" />
                <x-icons.moon id="icon-moon" class="size-4" />
            </x-ui.button>
        </div>
    </div>
</nav>

<script>
    (function () {
        const toggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('icon-sun');
        const moonIcon = document.getElementById('icon-moon');
        const html = document.documentElement;
        function setCookie(value) {
            document.cookie =
                'appearance=' +
                value +
                ';path=/;max-age=' +
                365 * 24 * 60 * 60 +
                ';SameSite=Lax';
        }
        function syncIcons(isDark) {
            sunIcon.classList.toggle('hidden', !isDark);
            moonIcon.classList.toggle('hidden', isDark);
        }
        syncIcons(html.classList.contains('dark'));
        toggle.addEventListener('click', function () {
            const isDark = html.classList.contains('dark');
            const newMode = isDark ? 'light' : 'dark';
            html.classList.toggle('dark', !isDark);
            html.style.colorScheme = !isDark ? 'dark' : 'light';
            localStorage.setItem('appearance', newMode);
            setCookie(newMode);
            syncIcons(!isDark);
        });
    })();
</script>
