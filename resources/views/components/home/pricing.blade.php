<section id="pricing" class="py-24">
    <div class="mx-auto max-w-6xl px-6">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium text-primary uppercase tracking-wider">Pricing</p>
            <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Simple, honest pricing
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                One plan, everything included. No hidden fees, no usage limits.
            </p>
            <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                30-day free trial — no credit card required
            </div>
        </div>

        <div class="mx-auto max-w-sm">
            <div class="relative overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-xl shadow-primary/10">
                {{-- Popular badge --}}
                <div class="absolute top-5 right-5">
                    <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        All-inclusive
                    </span>
                </div>

                <div class="p-8">
                    <h3 class="mb-1 text-lg font-semibold text-foreground">Pro</h3>
                    <p class="mb-6 text-sm text-muted-foreground">Everything you need to master your finances.</p>

                    <div class="mb-2 flex items-end gap-1">
                        <span class="text-5xl font-bold tracking-tight text-foreground" id="price-amount">$5</span>
                        <span class="mb-1 text-muted-foreground">/ month</span>
                    </div>
                    <p class="mb-8 text-xs text-muted-foreground">Free for the first 30 days, then billed monthly.</p>

                    @auth
                        <a href="{{ route('dashboard') }}"
                           class="block w-full cursor-pointer rounded-md bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                            Go to dashboard
                        </a>
                    @else
                        <a href="{{ route('register') }}"
                           class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                            Start free trial
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    @endauth
                    <p class="mt-3 text-center text-xs text-muted-foreground">No credit card required</p>

                    <ul class="mt-8 space-y-3">
                        @foreach ([
                            'Unlimited wallets & accounts',
                            'Unlimited transactions',
                            'Custom categories',
                            'Budget management',
                            'Savings goals',
                            'Recurring transactions',
                            'Visual reports & charts',
                            'CSV import & export',
                            'File attachments on transactions',
                        ] as $feature)
                            <li class="flex items-center gap-3 text-sm text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="2" stroke="currentColor" class="h-4 w-4 shrink-0 text-primary">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ $feature }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    (function () {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isBangladesh = timezone === 'Asia/Dhaka';

        if (isBangladesh) {
            document.getElementById('price-amount').textContent = '৳500';
        }
    })();
</script>
