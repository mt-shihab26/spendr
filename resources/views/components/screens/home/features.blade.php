<?php
$features = [
    ['icon' => 'inbox-stack',      'title' => 'Smart Wallets',            'desc' => 'Manage multiple accounts — cash, bank, credit cards — and always know your true balance across all of them.'],
    ['icon' => 'arrows-right-left', 'title' => 'Transaction Tracking',     'desc' => 'Log income and expenses with categories, attachments, and notes. Import from CSV or add manually in seconds.'],
    ['icon' => 'chart-bar',         'title' => 'Budget Management',        'desc' => 'Set spending limits per category and get a clear view of how you\'re tracking against your monthly budgets.'],
    ['icon' => 'flag',              'title' => 'Savings Goals',            'desc' => 'Create goals for vacations, emergency funds, or big purchases. Track your progress and celebrate milestones.'],
    ['icon' => 'arrow-path',        'title' => 'Recurring Transactions',   'desc' => 'Set up subscriptions and regular payments once. '. config("app.name") . '  auto-logs them so your records stay accurate without manual entry.'],
    ['icon' => 'chart-pie',         'title' => 'Visual Reports',           'desc' => 'Interactive charts showing spending patterns, income trends, and net worth over time. Export your data any time.'],
]
?>

<section id="features" class="py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium tracking-wider text-primary uppercase">Features</p>
            <h2
                class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
                Everything you need to manage money
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                From daily spending to long-term goals, {{config("app.name")}} covers all the tools you need to stay on top of your finances.
            </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ($features as $feature)
                <div
                    class="group border border-border bg-card p-6 transition-shadow hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20"
                >
                    <div
                        class="mb-4 flex h-10 w-10 items-center justify-center bg-primary/10"
                    >
                        <x-dynamic-component
                            :component="'icons.'.$feature['icon']"
                            class="h-5 w-5 text-primary"
                        />
                    </div>
                    <h3 class="mb-2 font-semibold text-foreground">
                        {{ $feature['title'] }}
                    </h3>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ $feature['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
