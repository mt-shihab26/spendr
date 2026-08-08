<section class="py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="relative overflow-hidden bg-primary px-8 py-16 text-center">
            {{-- Background pattern --}}
            <div
                class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] [background-size:32px_32px]"
            ></div>

            <div class="relative">
                <h2
                    class="mb-4 text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl"
                >
                    Take control of your money today
                </h2>
                <p class="mx-auto mb-8 max-w-lg text-primary-foreground/80">Join Spendr and get a clear picture of your finances. Free to start, no credit card required.</p>
                <div
                    class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    @auth
                        <x-ui.button
                            size="lg"
                            class="bg-primary-foreground text-primary hover:opacity-90"
                            href="{{ route('dashboard') }}"
                        >
                            Go to dashboard
                            <x-icons.squares-2x2 class="h-4 w-4" />
                        </x-ui.button>
                    @else
                        <x-ui.button
                            size="lg"
                            class="bg-primary-foreground text-primary hover:opacity-90"
                            href="{{ route('register') }}"
                        >
                            Start free trial
                            <x-icons.arrow-right class="h-4 w-4" />
                        </x-ui.button>
                        <x-ui.button
                            variant="ghost"
                            class="text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
                            href="{{ route('login') }}"
                        >
                            Already have an account? Sign in
                            <x-icons.login class="h-4 w-4" />
                        </x-ui.button>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</section>
