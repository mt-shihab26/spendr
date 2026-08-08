<textarea
    {{ $attributes->merge(['class' => 'w-full resize-none border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50']) }}
>{{ $slot }}</textarea>
