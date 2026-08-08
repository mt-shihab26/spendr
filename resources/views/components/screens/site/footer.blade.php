<footer class="border-t border-border py-12">
    <div class="mx-auto max-w-7xl px-4">
        <div
            class="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
            <a
                href="{{ route('home') }}"
                class="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
            >
                <img
                    src="{{ Vite::asset('resources/assets/logo-icon.svg') }}"
                    alt="Spendr"
                    class="h-6 w-6"
                />
                <x-app-logo />
            </a>
            <div class="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" class="transition-colors hover:text-foreground"
                    >Privacy Policy</a
                >
                <a href="#" class="transition-colors hover:text-foreground"
                    >Terms of Service</a
                >
                <a href="#" class="transition-colors hover:text-foreground"
                    >Cookie Policy</a
                >
                <a href="#" class="transition-colors hover:text-foreground"
                    >Refund Policy</a
                >
            </div>
            <p class="text-xs text-muted-foreground">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</footer>
