<section class="py-24">
    <div class="mx-auto max-w-6xl px-6">
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
                        <a href="{{ route('dashboard') }}"
                           class="cursor-pointer rounded-md bg-primary-foreground px-8 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
                            Go to dashboard &rarr;
                        </a>
                    @else
                        <a href="{{ route('register') }}"
                           class="cursor-pointer rounded-md bg-primary-foreground px-8 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
                            Create free account &rarr;
                        </a>
                        <a href="{{ route('login') }}"
                           class="text-sm text-primary-foreground/80 underline underline-offset-4 hover:text-primary-foreground">
                            Already have an account? Sign in
                        </a>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</section>
