<section class="relative overflow-hidden py-24 lg:py-36">
    {{-- Background grid --}}
    <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(0.511_0.096_186.391/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.511_0.096_186.391/0.05)_1px,transparent_1px)] [background-size:48px_48px]"></div>

    {{-- Glow --}}
    <div class="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>

    <div class="relative mx-auto max-w-6xl px-6 text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-xs text-muted-foreground">
            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
            Personal finance, simplified
        </div>

        <h1 class="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
            Your finances,<br>
            <span class="text-primary">finally under control</span>
        </h1>

        <p class="mx-auto mb-10 max-w-xl text-base text-muted-foreground lg:text-lg">
            Track spending, set budgets, and reach your savings goals — all from one clean dashboard. No spreadsheets needed.
        </p>

        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                <x-ui.button size="lg" variant="outline" href="#guide">
                    See how it works
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                </x-ui.button>
            @endauth
        </div>

        {{-- Dashboard preview --}}
        <div class="mt-16 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
            <div class="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span class="h-3 w-3 rounded-full bg-destructive/50"></span>
                <span class="h-3 w-3 rounded-full bg-yellow-400/50"></span>
                <span class="h-3 w-3 rounded-full bg-green-400/50"></span>
                <span class="ml-4 text-xs text-muted-foreground">spendr &mdash; dashboard</span>
            </div>
            <div class="grid grid-cols-3 gap-4 p-6 lg:grid-cols-4">
                {{-- Stat cards --}}
                <div class="col-span-3 grid grid-cols-3 gap-4 lg:col-span-4">
                    @foreach ([
                        ['label' => 'Total Balance', 'value' => '$12,480.00', 'sub' => '+2.4% this month', 'color' => 'text-primary'],
                        ['label' => 'Income', 'value' => '$4,200.00', 'sub' => 'This month', 'color' => 'text-[oklch(0.627_0.194_145.6)]'],
                        ['label' => 'Expenses', 'value' => '$1,890.50', 'sub' => 'This month', 'color' => 'text-destructive'],
                    ] as $stat)
                        <div class="rounded-lg border border-border bg-background p-4">
                            <p class="mb-1 text-xs text-muted-foreground">{{ $stat['label'] }}</p>
                            <p class="text-xl font-bold {{ $stat['color'] }}">{{ $stat['value'] }}</p>
                            <p class="mt-1 text-xs text-muted-foreground">{{ $stat['sub'] }}</p>
                        </div>
                    @endforeach
                </div>

                {{-- Transaction list preview --}}
                <div class="col-span-3 rounded-lg border border-border bg-background p-4">
                    <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent transactions</p>
                    <div class="space-y-3">
                        @foreach ([
                            ['name' => 'Grocery Store', 'category' => 'Food', 'amount' => '-$82.40', 'color' => 'text-destructive'],
                            ['name' => 'Salary Deposit', 'category' => 'Income', 'amount' => '+$4,200.00', 'color' => 'text-[oklch(0.627_0.194_145.6)]'],
                            ['name' => 'Netflix', 'category' => 'Entertainment', 'amount' => '-$15.99', 'color' => 'text-destructive'],
                            ['name' => 'Coffee Shop', 'category' => 'Food', 'amount' => '-$6.50', 'color' => 'text-destructive'],
                        ] as $tx)
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-accent"></div>
                                    <div>
                                        <p class="text-xs font-medium text-foreground">{{ $tx['name'] }}</p>
                                        <p class="text-xs text-muted-foreground">{{ $tx['category'] }}</p>
                                    </div>
                                </div>
                                <span class="text-sm font-mono font-medium {{ $tx['color'] }}">{{ $tx['amount'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Budget progress --}}
                <div class="hidden rounded-lg border border-border bg-background p-4 lg:block">
                    <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Budget</p>
                    <div class="space-y-3">
                        @foreach ([
                            ['label' => 'Food', 'pct' => 72],
                            ['label' => 'Transport', 'pct' => 45],
                            ['label' => 'Shopping', 'pct' => 88],
                        ] as $budget)
                            <div>
                                <div class="mb-1 flex justify-between text-xs">
                                    <span class="text-foreground">{{ $budget['label'] }}</span>
                                    <span class="text-muted-foreground">{{ $budget['pct'] }}%</span>
                                </div>
                                <div class="h-1.5 w-full rounded-full bg-accent">
                                    <div class="h-1.5 rounded-full bg-primary transition-all" style="width: {{ $budget['pct'] }}%"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
