<section id="pricing" class="py-24 bg-accent/30">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium text-primary uppercase tracking-wider">Pricing</p>
            <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Simple, honest pricing
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                One plan. Everything included. No surprises.
            </p>
            <div class="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                30-day free trial &mdash; no credit card required
            </div>
        </div>

        <div class="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2 lg:items-center">
            {{-- Price block --}}
            <div class="text-center lg:text-left">
                <div class="mb-4 flex items-end justify-center gap-2 lg:justify-start">
                    <span class="text-7xl font-bold tracking-tight text-foreground" id="price-amount">$5</span>
                    <span class="mb-3 text-lg text-muted-foreground">/ month</span>
                </div>
                <p class="mb-2 text-sm text-muted-foreground">Free for the first 30 days, then billed monthly.</p>
                <p class="mb-8 text-xs text-muted-foreground">Cancel any time.</p>

                @auth
                    <x-ui.button size="lg" href="{{ route('dashboard') }}">
                        Go to dashboard
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                    </x-ui.button>
                @else
                    <x-ui.button size="lg" href="{{ route('register') }}">
                        Start free trial
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </x-ui.button>
                @endauth
            </div>

            {{-- Features list --}}
            <ul class="space-y-3">
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
</section>

<script>
    (function () {
        if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Dhaka') {
            document.getElementById('price-amount').textContent = '৳500';
        }
    })();
</script>
