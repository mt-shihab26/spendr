<section id="how-it-works" class="py-24 bg-accent/30">
    <div class="mx-auto max-w-6xl px-6">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium text-primary uppercase tracking-wider">How it works</p>
            <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Get started in minutes
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                No complex setup. No imports needed. Start tracking your finances right away.
            </p>
        </div>

        <div class="relative grid gap-8 lg:grid-cols-3">
            {{-- Connector line (desktop) --}}
            <div class="absolute top-8 left-1/3 right-1/3 hidden h-px bg-border lg:block"></div>
            <div class="absolute top-8 left-2/3 right-0 hidden h-px bg-border lg:block"></div>

            @foreach ([
                [
                    'step' => '01',
                    'title' => 'Add your wallets',
                    'desc' => 'Connect your accounts — checking, savings, credit cards, or cash. Set a starting balance and you\'re ready.',
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />',
                ],
                [
                    'step' => '02',
                    'title' => 'Log your transactions',
                    'desc' => 'Record expenses and income manually or import from a CSV. Organize with categories and add notes or receipts.',
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />',
                ],
                [
                    'step' => '03',
                    'title' => 'Reach your goals',
                    'desc' => 'Set budgets to control spending, create savings goals, and use reports to understand where your money goes.',
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />',
                ],
            ] as $step)
                <div class="relative flex flex-col items-center text-center">
                    <div class="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-primary">
                            {!! $step['icon'] !!}
                        </svg>
                        <span class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {{ substr($step['step'], 1) }}
                        </span>
                    </div>
                    <h3 class="mb-3 text-lg font-semibold text-foreground">{{ $step['title'] }}</h3>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ $step['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
