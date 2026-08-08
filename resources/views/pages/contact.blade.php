<?php
$contacts = [
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
    [
        'icon'   => 'globe',
        'label'  => 'developershihab.com',
        'href'   => 'https://developershihab.com/',
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
            <h1 class="mb-4 text-4xl font-bold tracking-tight text-foreground">Get in touch</h1>
            <p class="max-w-md text-muted-foreground">Have a question or just want to say hi? Fill in the form or reach out directly.</p>
        </div>
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
                <p class="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reach out</p>
                <div class="space-y-3">
                    @foreach ($contacts as $contact)
                        <a
                            href="{{ $contact['href'] }}"
                            @if ($contact['target']) target="{{ $contact['target'] }}" rel="noopener noreferrer" @endif
                            class="flex items-center gap-4 border border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                            <x-dynamic-component :component="'icons.' . $contact['icon']" class="size-5 shrink-0" />
                            <span>{{ $contact['label'] }}</span>
                        </a>
                    @endforeach
                </div>
                <div class="mt-10 border-t border-border pt-8">
                    <p class="mb-2 text-sm font-medium text-foreground">Response time</p>
                    <p class="text-sm text-muted-foreground">I typically reply within 24–48 hours. For urgent matters, email is the fastest way to reach me.</p>
                </div>
            </div>
            <div>
                <p class="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Send a message</p>
                @if (session('success'))
                    <div class="mb-6 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                        {{ session('success') }}
                    </div>
                @endif
                <form method="POST" action="{{ route('contact.store') }}" class="space-y-5">
                    @csrf
                    <div class="grid gap-5 sm:grid-cols-2">
                        <div class="space-y-1.5">
                            <label for="name" class="text-xs font-medium text-foreground">Name</label>
                            <x-ui.input
                                id="name"
                                name="name"
                                type="text"
                                :value="old('name')"
                                placeholder="Your name"
                                @error('name') class="border-destructive" @enderror
                            />
                            @error('name')
                                <p class="text-xs text-destructive">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="space-y-1.5">
                            <label for="email" class="text-xs font-medium text-foreground">Email</label>
                            <x-ui.input
                                id="email"
                                name="email"
                                type="email"
                                :value="old('email')"
                                placeholder="you@example.com"
                                @error('email') class="border-destructive" @enderror
                            />
                            @error('email')
                                <p class="text-xs text-destructive">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label for="subject" class="text-xs font-medium text-foreground">Subject</label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            value="{{ old('subject') }}"
                            placeholder="What's this about?"
                            class="w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50 @error('subject') border-destructive @enderror"
                        />
                        @error('subject')
                            <p class="text-xs text-destructive">{{ $message }}</p>
                        @enderror
                    </div>
                    <div class="space-y-1.5">
                        <label for="message" class="text-xs font-medium text-foreground">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            placeholder="Tell me what's on your mind..."
                            class="w-full resize-none border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50 @error('message') border-destructive @enderror"
                        >{{ old('message') }}</textarea>
                        @error('message')
                            <p class="text-xs text-destructive">{{ $message }}</p>
                        @enderror
                    </div>
                    <x-ui.button type="submit" size="lg">
                        Send message
                        <x-icons.arrow-right class="size-4" />
                    </x-ui.button>
                </form>
            </div>

        </div>
    </div>
</x-layouts.site>
