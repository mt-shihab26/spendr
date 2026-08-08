<section id="features" class="py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="text-primary mb-3 text-sm font-medium tracking-wider uppercase">Features</p>
            <h2 class="text-foreground mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
                Everything you need to manage money
            </h2>
            <p class="text-muted-foreground mx-auto max-w-xl">
                From daily spending to long-term goals, Spendr covers all the tools you need to stay on top of your
                finances.
            </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ([
                ['icon' => 'inbox-stack',      'title' => 'Smart Wallets',            'desc' => 'Manage multiple accounts — cash, bank, credit cards — and always know your true balance across all of them.'],
                ['icon' => 'arrows-right-left', 'title' => 'Transaction Tracking',     'desc' => 'Log income and expenses with categories, attachments, and notes. Import from CSV or add manually in seconds.'],
                ['icon' => 'chart-bar',         'title' => 'Budget Management',        'desc' => 'Set spending limits per category and get a clear view of how you\'re tracking against your monthly budgets.'],
                ['icon' => 'flag',              'title' => 'Savings Goals',            'desc' => 'Create goals for vacations, emergency funds, or big purchases. Track your progress and celebrate milestones.'],
                ['icon' => 'arrow-path',        'title' => 'Recurring Transactions',   'desc' => 'Set up subscriptions and regular payments once. Spendr auto-logs them so your records stay accurate without manual entry.'],
                ['icon' => 'chart-pie',         'title' => 'Visual Reports',           'desc' => 'Interactive charts showing spending patterns, income trends, and net worth over time. Export your data any time.'],
            ] as $feature)
                <div class="group border-border bg-card border p-6 transition-shadow hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20">
                    <div class="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center">
                        <x-dynamic-component :component="'icons.'.$feature['icon']" class="text-primary h-5 w-5" />
                    </div>
                    <h3 class="text-foreground mb-2 font-semibold">{{ $feature['title'] }}</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">{{ $feature['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
