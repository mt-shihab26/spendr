@props (['label' => null])
@php
    $name = $attributes->get('name', '');
    $inputId = $attributes->get('id', $name);
    $hasError = $errors->has($name);
@endphp

<div class="space-y-1.5">
    @if ($label)
        <label
            for="{{ $inputId }}"
            class="text-xs font-medium text-foreground"
            >{{ $label }}</label
        >
    @endif
    <textarea
        {{ $attributes->class([
            'w-full resize-none border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1',
            'border-destructive focus:border-destructive focus:ring-destructive/50' => $hasError,
            'border-border focus:border-ring focus:ring-ring/50' => ! $hasError,
        ]) }}
        >{{ $slot }}</textarea
    >
    @if ($hasError)
        <p class="text-xs text-destructive">{{ $errors->first($name) }}</p>
    @endif
</div>
