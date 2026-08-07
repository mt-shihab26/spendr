@php
    $variant = $variant ?? 'default';
    $size    = $size ?? 'default';
    $tag     = isset($href) ? 'a' : 'button';

    $base = 'inline-flex cursor-pointer shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4';

    $variants = [
        'default'     => 'bg-primary text-primary-foreground hover:opacity-90',
        'outline'     => 'border border-border bg-background text-foreground hover:bg-accent',
        'secondary'   => 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'ghost'       => 'text-foreground hover:bg-accent',
        'destructive' => 'bg-destructive/10 text-destructive hover:bg-destructive/20',
        'link'        => 'text-primary underline-offset-4 hover:underline',
    ];

    $sizes = [
        'default' => 'h-9 px-4 text-sm rounded-none',
        'sm'      => 'h-8 px-3 text-xs rounded-none',
        'lg'      => 'h-11 px-6 text-sm rounded-none',
        'icon'    => 'size-9 rounded-none',
    ];

    $classes = implode(' ', array_filter([
        $base,
        $variants[$variant] ?? $variants['default'],
        $sizes[$size]       ?? $sizes['default'],
    ]));
@endphp

@if ($tag === 'a')
    <a {{ $attributes->merge(['class' => $classes, 'href' => $href]) }}>
        {{ $slot }}
    </a>
@else
    <button {{ $attributes->merge(['class' => $classes, 'type' => $type ?? 'button']) }}>
        {{ $slot }}
    </button>
@endif
