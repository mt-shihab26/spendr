@php
$navLinks = [
    ['label' => 'Features', 'href' => '#features', 'section' => 'features'],
    ['label' => 'Guide',    'href' => '#guide',    'section' => 'guide'],
    ['label' => 'Pricing',  'href' => '#pricing',  'section' => 'pricing'],
];
@endphp

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
            <button
                id="theme-toggle"
                type="button"
                aria-label="Toggle theme"
                class="flex size-9 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                <x-icons.sun id="icon-sun" class="hidden size-4" />
                <x-icons.moon id="icon-moon" class="size-4" />
            </button>
            @auth
                <x-ui.button href="{{ route('dashboard') }}">
                    Dashboard
                    <x-icons.squares-2x2 class="size-4" />
                </x-ui.button>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <x-ui.button variant="outline" type="submit">
                        Sign out
                        <x-icons.logout class="size-4" />
                    </x-ui.button>
                </form>
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
