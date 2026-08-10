<?php
$contacts = [
    [
        'icon'   => 'globe',
        'label'  => 'developershihab.com',
        'href'   => 'https://developershihab.com/',
        'target' => '_blank',
    ],
    [
        'icon'   => 'envelope',
        'label'  => 'mt.shihab26@gmail.com',
        'href'   => 'mailto:mt.shihab26@gmail.com',
        'target' => null,
    ],
    [
        'icon'   => 'linkedin',
        'label'  => 'linkedin.com/in/mt-shihab26',
        'href'   => 'https://linkedin.com/in/mt-shihab26',
        'target' => '_blank',
    ],
    [
        'icon'   => 'x-twitter',
        'label'  => 'x.com/mt_shihab26',
        'href'   => 'https://x.com/mt_shihab26',
        'target' => '_blank',
    ],
    [
        'icon'   => 'github',
        'label'  => 'github.com/mt-shihab26',
        'href'   => 'https://github.com/mt-shihab26',
        'target' => '_blank',
    ],

];
?>

<x-layouts.site
    title="Contact — {{ config('app.name') }}"
    description="Get in touch via email or connect on social media."
>
    <div class="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div class="mb-12">
            <p class="mb-3 text-sm font-medium text-primary">Contact</p>
            <h1 class="mb-4 text-4xl font-bold tracking-tight text-foreground">
                Get in touch
            </h1>
            <p class="max-w-md text-muted-foreground">Have a question or just want to say hi? Fill in the form or reach out directly.</p>
        </div>
        <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div class="rounded-xl border border-border bg-card p-8">
                <p class="mb-6 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Reach out</p>
                <div class="space-y-3">
                    @foreach ($contacts as $contact)
                        <a
                            href="{{ $contact['href'] }}"
                            @if ($contact['target']) target="{{ $contact['target'] }}" rel="noopener noreferrer" @endif
                            class="flex items-center gap-4 border border-border bg-background p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                            <x-dynamic-component
                                :component="'icons.' . $contact['icon']"
                                class="size-5 shrink-0"
                            />
                            <span>{{ $contact['label'] }}</span>
                        </a>
                    @endforeach
                </div>
                <div class="mt-10 border-t border-border pt-8">
                    <p class="mb-2 text-sm font-medium text-foreground">Response time</p>
                    <p class="text-sm text-muted-foreground">I typically reply within 24–48 hours. For urgent matters, email is the fastest way to reach me.</p>
                </div>
            </div>
            <x-screens.contact.form />
        </div>
    </div>
</x-layouts.site>
