<section class="py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center">
            {{-- Background pattern --}}
            <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] [background-size:32px_32px]"></div>

            <div class="relative">
                <h2 class="mb-4 text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl">
                    Take control of your money today
                </h2>
                <p class="mx-auto mb-8 max-w-lg text-primary-foreground/80">
                    Join Spendr and get a clear picture of your finances. Free to start, no credit card required.
                </p>
                <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    @auth
                        <x-ui.button size="lg" class="bg-primary-foreground text-primary hover:opacity-90" href="{{ route('dashboard') }}">
                            Go to dashboard
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            </svg>
                        </x-ui.button>
                    @else
                        <x-ui.button size="lg" class="bg-primary-foreground text-primary hover:opacity-90" href="{{ route('register') }}">
                            Start free trial
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </x-ui.button>
                        <x-ui.button variant="ghost" class="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10" href="{{ route('login') }}">
                            Already have an account? Sign in
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </x-ui.button>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</section>
