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
            <div class="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <x-icons.clock class="h-4 w-4" />
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
                        <x-icons.squares-2x2 class="h-4 w-4" />
                    </x-ui.button>
                @else
                    <x-ui.button size="lg" href="{{ route('register') }}">
                        Start free trial
                        <x-icons.arrow-right class="h-4 w-4" />
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
                        <x-icons.check class="h-4 w-4 shrink-0 text-primary" stroke-width="2" />
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
