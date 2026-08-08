<section id="pricing" class="bg-accent/30 py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="text-primary mb-3 text-sm font-medium tracking-wider uppercase">Pricing</p>
            <h2 class="text-foreground mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Simple, honest pricing</h2>
            <p class="text-muted-foreground mx-auto max-w-xl">One plan. Everything included. No surprises.</p>
            <div class="border-primary/30 bg-primary/5 text-primary mt-4 inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium">
                <x-icons.clock class="h-4 w-4" />
                30-day free trial &mdash; no credit card required
            </div>
        </div>

        <div class="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2 lg:items-center">
            {{-- Price block --}}
            <div class="text-center lg:text-left">
                <div class="mb-4 flex items-end justify-center gap-2 lg:justify-start">
                    <span class="text-foreground text-7xl font-bold tracking-tight" id="price-amount">$5</span>
                    <span class="text-muted-foreground mb-3 text-lg">/ month</span>
                </div>
                <p class="text-muted-foreground mb-2 text-sm">Free for the first 30 days, then billed monthly.</p>
                <p class="text-muted-foreground mb-8 text-xs">Cancel any time.</p>

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
                    <li class="text-muted-foreground flex items-center gap-3 text-sm">
                        <x-icons.check class="text-primary h-4 w-4 shrink-0" stroke-width="2" />
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
