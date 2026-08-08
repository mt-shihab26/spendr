<?php
$steps = [
    [
        'step'  => '01',
        'icon'  => 'inbox-stack',
        'title' => 'Add your wallets',
        'desc'  => 'Add your accounts — checking, savings, credit cards, or cash. Set a starting balance and you\'re ready.',
    ],
    [
        'step'  => '02',
        'icon'  => 'plus',
        'title' => 'Log your transactions',
        'desc'  => 'Record expenses and income manually or import from a CSV. Organize with categories and add notes or receipts.',
    ],
    [
        'step'  => '03',
        'icon'  => 'check',
        'title' => 'Reach your goals',
        'desc'  => 'Set budgets to control spending, create savings goals, and use reports to understand where your money goes.',
    ],
]
?>

<section id="guide" class="bg-accent/30 py-10 lg:py-16">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium tracking-wider text-primary uppercase">How it works</p>
            <h2
                class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
                Start free trial
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">
                No complex setup. No imports needed. Start tracking your finances right away.
            </p>
        </div>
        <div class="relative grid gap-8 lg:grid-cols-3">
            <div
                class="absolute top-8 right-1/3 left-1/3 hidden h-px bg-border lg:block"
            ></div>
            <div
                class="absolute top-8 right-0 left-2/3 hidden h-px bg-border lg:block"
            ></div>

            @foreach ($steps as $step)
                <div class="relative flex flex-col items-center text-center">
                    <div
                        class="relative mb-6 flex h-16 w-16 items-center justify-center border-2 border-primary bg-background"
                    >
                        <x-dynamic-component
                            :component="'icons.'.$step['icon']"
                            class="h-6 w-6 text-primary"
                        />
                        <span
                            class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-primary text-xs font-bold text-primary-foreground"
                        >
                            {{ substr($step['step'], 1) }}
                        </span>
                    </div>
                    <h3 class="mb-3 text-lg font-semibold text-foreground">
                        {{ $step['title'] }}
                    </h3>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ $step['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
