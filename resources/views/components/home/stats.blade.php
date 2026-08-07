<section class="border-y border-border py-16">
    <div class="mx-auto max-w-6xl px-6">
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
            @foreach ([
                ['value' => 'Unlimited', 'label' => 'Wallets & accounts'],
                ['value' => 'Custom', 'label' => 'Transaction categories'],
                ['value' => 'Auto', 'label' => 'Recurring entries'],
                ['value' => 'Visual', 'label' => 'Reports & charts'],
            ] as $stat)
                <div class="text-center">
                    <p class="mb-1 text-2xl font-bold text-primary lg:text-3xl">{{ $stat['value'] }}</p>
                    <p class="text-sm text-muted-foreground">{{ $stat['label'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
