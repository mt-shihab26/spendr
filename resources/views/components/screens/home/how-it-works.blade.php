<section id="guide" class="bg-accent/30 py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="text-primary mb-3 text-sm font-medium tracking-wider uppercase">How it works</p>
            <h2 class="text-foreground mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Start free trial</h2>
            <p class="text-muted-foreground mx-auto max-w-xl">
                No complex setup. No imports needed. Start tracking your finances right away.
            </p>
        </div>

        <div class="relative grid gap-8 lg:grid-cols-3">
            {{-- Connector line (desktop) --}}
            <div class="bg-border absolute top-8 right-1/3 left-1/3 hidden h-px lg:block"></div>
            <div class="bg-border absolute top-8 right-0 left-2/3 hidden h-px lg:block"></div>

            @foreach ([
                ['step' => '01', 'icon' => 'inbox-stack', 'title' => 'Add your wallets',       'desc' => 'Connect your accounts — checking, savings, credit cards, or cash. Set a starting balance and you\'re ready.'],
                ['step' => '02', 'icon' => 'plus',        'title' => 'Log your transactions',  'desc' => 'Record expenses and income manually or import from a CSV. Organize with categories and add notes or receipts.'],
                ['step' => '03', 'icon' => 'check',       'title' => 'Reach your goals',       'desc' => 'Set budgets to control spending, create savings goals, and use reports to understand where your money goes.'],
            ] as $step)
                <div class="relative flex flex-col items-center text-center">
                    <div class="border-primary bg-background relative mb-6 flex h-16 w-16 items-center justify-center border-2">
                        <x-dynamic-component :component="'icons.'.$step['icon']" class="text-primary h-6 w-6" />
                        <span class="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center text-xs font-bold">
                            {{ substr($step['step'], 1) }}
                        </span>
                    </div>
                    <h3 class="text-foreground mb-3 text-lg font-semibold">{{ $step['title'] }}</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">{{ $step['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
