<section class="relative overflow-hidden py-24 lg:py-36">
    {{-- Background grid --}}
    <div class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(0.511_0.096_186.391/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.511_0.096_186.391/0.05)_1px,transparent_1px)] [background-size:48px_48px]"></div>

    {{-- Glow --}}
    <div class="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"></div>

    <div class="relative mx-auto max-w-7xl px-4 text-center">
        <div class="border-border bg-accent text-muted-foreground mb-6 inline-flex items-center gap-2 border px-4 py-1.5 text-xs">
            <span class="bg-primary h-1.5 w-1.5 rounded-full"></span>
            Personal finance, simplified
        </div>

        <h1 class="text-foreground mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
            Your finances,<br />
            <span class="text-primary">finally under control</span>
        </h1>

        <p class="text-muted-foreground mx-auto mb-10 max-w-xl text-base lg:text-lg">
            Track spending, set budgets, and reach your savings goals — all from one clean dashboard. No spreadsheets
            needed.
        </p>

        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                <x-ui.button size="lg" variant="outline" href="#guide">
                    See how it works
                    <x-icons.play class="h-4 w-4" />
                </x-ui.button>
            @endauth
        </div>

        {{-- Dashboard preview --}}
        <div class="border-border bg-card mt-16 overflow-hidden border shadow-2xl shadow-black/10 dark:shadow-black/40">
            <div class="border-border flex items-center gap-1.5 border-b px-4 py-3">
                <span class="bg-destructive/50 h-3 w-3 rounded-full"></span>
                <span class="h-3 w-3 rounded-full bg-yellow-400/50"></span>
                <span class="h-3 w-3 rounded-full bg-green-400/50"></span>
                <span class="text-muted-foreground ml-4 text-xs">spendr &mdash; dashboard</span>
            </div>
            <div class="grid grid-cols-3 gap-4 p-6 lg:grid-cols-4">
                {{-- Stat cards --}}
                <div class="col-span-3 grid grid-cols-3 gap-4 lg:col-span-4">
                    @foreach ([
                        ['label' => 'Total Balance', 'value' => '$12,480.00', 'sub' => '+2.4% this month', 'color' => 'text-primary'],
                        ['label' => 'Income', 'value' => '$4,200.00', 'sub' => 'This month', 'color' => 'text-[oklch(0.627_0.194_145.6)]'],
                        ['label' => 'Expenses', 'value' => '$1,890.50', 'sub' => 'This month', 'color' => 'text-destructive'],
                    ] as $stat)
                        <div class="border-border bg-background border p-4">
                            <p class="text-muted-foreground mb-1 text-xs">{{ $stat['label'] }}</p>
                            <p class="text-xl font-bold {{ $stat['color'] }}">{{ $stat['value'] }}</p>
                            <p class="text-muted-foreground mt-1 text-xs">{{ $stat['sub'] }}</p>
                        </div>
                    @endforeach
                </div>

                {{-- Transaction list preview --}}
                <div class="border-border bg-background col-span-3 border p-4">
                    <p class="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                        Recent transactions
                    </p>
                    <div class="space-y-3">
                        @foreach ([
                            ['name' => 'Grocery Store', 'category' => 'Food', 'amount' => '-$82.40', 'color' => 'text-destructive'],
                            ['name' => 'Salary Deposit', 'category' => 'Income', 'amount' => '+$4,200.00', 'color' => 'text-[oklch(0.627_0.194_145.6)]'],
                            ['name' => 'Netflix', 'category' => 'Entertainment', 'amount' => '-$15.99', 'color' => 'text-destructive'],
                            ['name' => 'Coffee Shop', 'category' => 'Food', 'amount' => '-$6.50', 'color' => 'text-destructive'],
                        ] as $tx)
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="bg-accent h-8 w-8 rounded-full"></div>
                                    <div>
                                        <p class="text-foreground text-xs font-medium">{{ $tx['name'] }}</p>
                                        <p class="text-muted-foreground text-xs">{{ $tx['category'] }}</p>
                                    </div>
                                </div>
                                <span class="text-sm font-mono font-medium {{ $tx['color'] }}">{{ $tx['amount'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Budget progress --}}
                <div class="border-border bg-background hidden border p-4 lg:block">
                    <p class="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">Budget</p>
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
                                <div class="bg-accent h-1.5 w-full rounded-full">
                                    <div
                                        class="bg-primary h-1.5 rounded-full transition-all"
                                        style="width: {{ $budget['pct'] }}%"
                                    ></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
