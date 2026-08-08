@props (['title', 'description', 'heading'])

<x-layouts.site :title="$title" :description="$description">
    <div class="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div class="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <div class="min-w-0 flex-1">
                <div class="mb-12">
                    <p class="mb-3 text-sm font-medium text-primary">Legal</p>
                    <h1
                        class="mb-4 text-4xl font-bold tracking-tight text-foreground"
                    >
                        {{ $heading }}
                    </h1>
                    <p class="text-muted-foreground">Last updated: {{ date('F j, Y') }}</p>
                </div>
                <div class="space-y-10">{{ $slot }}</div>
            </div>

            <aside class="shrink-0 lg:w-56">
                <div class="sticky top-30">
                    <p class="mb-4 text-xs font-semibold tracking-widest text-primary">Legal</p>
                    <nav class="space-y-1">
                        @foreach ([
                            ['label' => 'Privacy Policy', 'route' => 'privacy-policy'],
                            ['label' => 'Terms of Service', 'route' => 'terms-of-service'],
                            ['label' => 'Cookie Policy', 'route' => 'cookie-policy'],
                            ['label' => 'Refund Policy', 'route' => 'refund-policy'],
                        ] as $link)
                            <a
                                href="{{ route($link['route']) }}"
                                @class ([
                                    'block border-l-2 px-4 py-2.5 text-sm transition-colors',
                                    'border-primary font-medium text-foreground'           => request()->routeIs($link['route']),
                                    'border-transparent text-muted-foreground hover:border-border hover:text-foreground' => ! request()->routeIs($link['route']),
                                ])
                            >
                                {{ $link['label'] }}
                            </a>
                        @endforeach
                    </nav>
                </div>
            </aside>
        </div>
    </div>
</x-layouts.site>
