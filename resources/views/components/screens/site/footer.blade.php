<?php
$home = route('home');

$links = [
    [
        'label' => 'Privacy Policy',
        'href'  => $home . '#privacy',
    ],
    [
        'label' => 'Terms of Service',
        'href'  => $home . '#terms',
    ],
    [
        'label' => 'Cookie Policy',
        'href'  => $home . '#cookies',
    ],
    [
        'label' => 'Refund Policy',
        'href'  => $home . '#refund',
    ],
];
?>

<footer class="border-t border-border py-12">
    <div class="mx-auto max-w-7xl px-4">
        <div
            class="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
            <a
                class="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
                href="{{ route('home') }}"
            >
                <img
                    class="size-6"
                    src="{{ Vite::asset('resources/assets/logo-icon.svg') }}"
                    alt="{{ config('app.name') }}"
                />
                <x-icons.app-logo />
            </a>
            <div class="flex items-center gap-6 text-sm text-muted-foreground">
                @foreach ($links as $link)
                    <a
                        class="transition-colors hover:text-foreground"
                        href="{{ $link['href'] }}"
                    >
                        {{ $link['label'] }}
                    </a>
                @endforeach
            </div>
            <p class="text-xs text-muted-foreground">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</footer>
