<?php
$faqs = [
    [
        'question' => 'Is there a free trial?',
        'answer'   => 'Yes. You get a ' . config('pricing.trial_days') . '-day free trial with full access to every feature — no credit card required. Your trial starts the moment you create an account.',
    ],
    [
        'question' => 'What happens when my trial ends?',
        'answer'   => 'You\'ll be prompted to subscribe to continue using ' . config('app.name') . '. If you choose not to, your account is downgraded and you can still log in to export your data.',
    ],
    [
        'question' => 'Can I cancel any time?',
        'answer'   => 'Absolutely. Cancel from your account settings with one click. You keep access until the end of the billing period and won\'t be charged again.',
    ],
    [
        'question' => 'Does ' . config('app.name') . ' connect to my bank?',
        'answer'   => 'No. ' . config('app.name') . ' is manual-entry by design. You enter and categorise your own transactions, which keeps your banking credentials entirely private.',
    ],
    [
        'question' => 'Is my financial data secure?',
        'answer'   => 'Yes. All data is encrypted in transit (TLS) and at rest. We never sell your data or share it with third parties. You can export or delete everything from your settings at any time.',
    ],
    [
        'question' => 'Can I import transactions from a CSV?',
        'answer'   => 'Yes. ' . config('app.name') . ' supports CSV import so you can bulk-load transaction history exported from your bank. You can also export all your data at any time.',
    ],
    [
        'question' => 'How many wallets and transactions can I have?',
        'answer'   => 'Unlimited. There are no caps on wallets, transactions, categories, budgets, or savings goals on the paid plan.',
    ],
    [
        'question' => 'Do you offer refunds?',
        'answer'   => 'Yes. If you\'re not satisfied within 30 days of your first charge, contact us for a full refund — no questions asked. See our Refund Policy for details.',
    ],
];
?>

<section id="faq" class="py-10 lg:py-16">
    <div class="mx-auto max-w-7xl px-4">
        <div class="mb-16 text-center">
            <p class="mb-3 text-sm font-medium tracking-wider text-primary uppercase">FAQ</p>
            <h2
                class="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
                Frequently asked questions
            </h2>
            <p class="mx-auto max-w-xl text-muted-foreground">Everything you need to know before getting started.</p>
        </div>
        <div class="mx-auto max-w-3xl divide-y divide-border">
            @foreach ($faqs as $faq)
                <details class="group py-5">
                    <summary
                        class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground"
                    >
                        {{ $faq['question'] }}
                        <span
                            class="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                        >
                            <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </span>
                    </summary>
                    <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{{ $faq['answer'] }}</p>
                </details>
            @endforeach
        </div>
    </div>
</section>
