@props (['heading'])

<div class="rounded-lg border border-border p-5">
    <h3 class="mb-2 font-semibold text-foreground">{{ $heading }}</h3>
    <p class="text-sm leading-relaxed text-muted-foreground">{{ $slot }}</p>
</div>
