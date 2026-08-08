<section class="border-border border-y py-16">
    <div class="mx-auto max-w-7xl px-4">
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
            @foreach ([
                ['value' => 'Unlimited', 'label' => 'Wallets & accounts'],
                ['value' => 'Custom', 'label' => 'Transaction categories'],
                ['value' => 'Auto', 'label' => 'Recurring entries'],
                ['value' => 'Visual', 'label' => 'Reports & charts'],
            ] as $stat)
                <div class="text-center">
                    <p class="text-primary mb-1 text-2xl font-bold lg:text-3xl">{{ $stat['value'] }}</p>
                    <p class="text-muted-foreground text-sm">{{ $stat['label'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
