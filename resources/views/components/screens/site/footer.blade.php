<footer class="border-border border-t py-12">
    <div class="mx-auto max-w-7xl px-4">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
                <a
                    href="{{ route('home') }}"
                    class="text-foreground inline-flex items-center gap-2 text-lg font-bold tracking-tight"
                >
                    <img src="{{ Vite::asset('resources/assets/logo-icon.svg') }}" alt="Spendr" class="h-6 w-6" />
                    spendr<span class="text-primary">.</span>
                </a>
                <p class="text-muted-foreground mt-1 text-xs">Personal finance tracking</p>
            </div>
            <div class="text-muted-foreground flex items-center gap-6 text-sm">
                <a href="#features" class="hover:text-foreground transition-colors">Features</a>
                <a href="#guide" class="hover:text-foreground transition-colors">Guide</a>
                @guest
                    <a href="{{ route('login') }}" class="hover:text-foreground transition-colors">Sign in</a>
                    <a href="{{ route('register') }}" class="hover:text-foreground transition-colors"
                        >Start free trial</a>
                @endguest
            </div>
            <p class="text-muted-foreground text-xs">
                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</footer>
