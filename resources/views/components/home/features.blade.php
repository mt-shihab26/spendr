<section id="features" class="py-24">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium text-primary uppercase tracking-wider">Features</p>
            <h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Everything you need to manage money
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                From daily spending to long-term goals, Spendr covers all the tools you need to stay on top of your finances.
            </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ([
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />',
                    'title' => 'Smart Wallets',
                    'desc' => 'Manage multiple accounts — cash, bank, credit cards — and always know your true balance across all of them.',
                ],
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />',
                    'title' => 'Transaction Tracking',
                    'desc' => 'Log income and expenses with categories, attachments, and notes. Import from CSV or add manually in seconds.',
                ],
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
                    'title' => 'Budget Management',
                    'desc' => 'Set spending limits per category and get a clear view of how you\'re tracking against your monthly budgets.',
                ],
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />',
                    'title' => 'Savings Goals',
                    'desc' => 'Create goals for vacations, emergency funds, or big purchases. Track your progress and celebrate milestones.',
                ],
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />',
                    'title' => 'Recurring Transactions',
                    'desc' => 'Set up subscriptions and regular payments once. Spendr auto-logs them so your records stay accurate without manual entry.',
                ],
                [
                    'icon' => '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />',
                    'title' => 'Visual Reports',
                    'desc' => 'Interactive charts showing spending patterns, income trends, and net worth over time. Export your data any time.',
                ],
            ] as $feature)
                <div class="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20">
                    <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-primary">
                            {!! $feature['icon'] !!}
                        </svg>
                    </div>
                    <h3 class="mb-2 font-semibold text-foreground">{{ $feature['title'] }}</h3>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ $feature['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
