<nav class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="{{ route('home') }}" class="flex items-center gap-2">
            <span class="text-xl font-bold tracking-tight text-foreground">
                spendr<span class="text-primary">.</span>
            </span>
        </a>

        <div class="hidden items-center gap-8 md:flex">
            <a href="#features" class="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" class="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
        </div>

        <div class="flex items-center gap-3">
            {{-- Theme switcher --}}
            <button id="theme-toggle" type="button" aria-label="Toggle theme"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                {{-- Sun icon (shown in dark mode) --}}
                <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="hidden h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                {{-- Moon icon (shown in light mode) --}}
                <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            </button>

            @auth
                <a href="{{ route('dashboard') }}"
                   class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90">
                    Dashboard
                </a>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit"
                            class="cursor-pointer rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent">
                        Sign out
                    </button>
                </form>
            @else
                <a href="{{ route('login') }}"
                   class="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent">
                    Sign in
                </a>
                <a href="{{ route('register') }}"
                   class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:opacity-90">
                    Get started
                </a>
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

        function applyTheme(isDark) {
            if (isDark) {
                html.classList.add('dark');
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                html.classList.remove('dark');
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }

        applyTheme(localStorage.getItem('theme') === 'dark');

        toggle.addEventListener('click', function () {
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            applyTheme(!isDark);
        });
    })();
</script>
