<section class="py-10 lg:py-16">
    <div class="mx-auto max-w-7xl px-4 text-center">
        <div
            class="mb-6 inline-flex items-center gap-2 border border-border bg-accent px-4 py-1.5 text-xs text-muted-foreground"
        >
            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
            Personal finance, simplified
        </div>
        <h1
            class="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground lg:text-6xl"
        >
            Your finances,<br />
            <span class="text-primary">finally under control</span>
        </h1>
        <p class="mx-auto mb-10 max-w-xl text-base text-muted-foreground lg:text-lg">Track spending, set budgets, and reach your savings goals — all from one clean dashboard. No spreadsheets needed.</p>
        <div
            class="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
            @auth
                <x-ui.button size="lg" href="{{ route('dashboard') }}">
                    Go to dashboard
                    <x-icons.squares-2x2 class="h-4 w-4" />
                </x-ui.button>
            @else
                <x-ui.button size="lg" href="{{ route('register') }}">
                    Start free trial
                    <x-icons.arrow-right class="h-4 w-4" />
                </x-ui.button>
                <x-ui.button size="lg" variant="outline" href="#guide">
                    See how it works
                    <x-icons.play class="h-4 w-4" />
                </x-ui.button>
            @endauth
        </div>
        <x-screens.home.video-showcase />
    </div>
</section>
