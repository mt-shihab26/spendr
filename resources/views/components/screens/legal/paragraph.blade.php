@props(['class' => ''])

<p @class(['leading-relaxed text-muted-foreground', $class])>{{ $slot }}</p>
