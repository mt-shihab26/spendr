@props(['heading'])

<section>
    <h2 class="mb-4 text-xl font-semibold text-foreground">{{ $heading }}</h2>
    {{ $slot }}
</section>
