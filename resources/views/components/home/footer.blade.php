<footer class="border-t border-border py-12">
    <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
                <a href="{{ route('home') }}" class="text-lg font-bold tracking-tight text-foreground">
                    spendr<span class="text-primary">.</span>
                </a>
                <p class="mt-1 text-xs text-muted-foreground">Personal finance tracking</p>
            </div>

            <div class="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#features" class="transition-colors hover:text-foreground">Features</a>
                <a href="#guide" class="transition-colors hover:text-foreground">Guide</a>
                @guest
                    <a href="{{ route('login') }}" class="transition-colors hover:text-foreground">Sign in</a>
                    <a href="{{ route('register') }}" class="transition-colors hover:text-foreground">Start free trial</a>
                @endguest
            </div>

            <p class="text-xs text-muted-foreground">
                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</footer>
