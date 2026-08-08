<x-layouts.site
    title="Contact — {{ config('app.name') }}"
    description="Get in touch via email or connect on social media."
>
    <div class="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div class="mb-12 text-center">
            <p class="mb-3 text-sm font-medium text-primary">Contact</p>
            <h1 class="mb-4 text-4xl font-bold tracking-tight text-foreground">Get in touch</h1>
            <p class="mx-auto max-w-md text-muted-foreground">Get in touch with me via email or connect on social media.</p>
        </div>

        <div class="mx-auto max-w-sm">
            <p class="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reach out</p>
            <div class="space-y-4">
                <a
                    href="mailto:mt.shihab26@gmail.com"
                    class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                    <x-icons.envelope class="size-5 shrink-0" />
                    <span>mt.shihab26@gmail.com</span>
                </a>

                <a
                    href="https://linkedin.com/in/mt-shihab26"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                    <x-icons.linkedin class="size-5 shrink-0" />
                    <span>linkedin.com/in/mt-shihab26</span>
                </a>

                <a
                    href="https://x.com/mt_shihab26"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                    <x-icons.x-twitter class="size-5 shrink-0" />
                    <span>x.com/mt_shihab26</span>
                </a>

                <a
                    href="https://github.com/mt-shihab26"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                    <x-icons.github class="size-5 shrink-0" />
                    <span>github.com/mt-shihab26</span>
                </a>

                <a
                    href="https://developershihab.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                    <x-icons.globe class="size-5 shrink-0" />
                    <span>developershihab.com</span>
                </a>
            </div>
        </div>
    </div>
</x-layouts.site>
