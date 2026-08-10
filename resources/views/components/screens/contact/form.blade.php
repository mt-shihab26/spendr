<div class="rounded-xl border border-border bg-card p-8">
    <p class="mb-6 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Send a message</p>
    @if (session('success'))
        <div
            class="mb-6 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"
        >
            {{ session('success') }}
        </div>
    @endif
    <form method="POST" action="{{ route('contact.store') }}" class="space-y-5">
        @csrf
        <div class="grid gap-5 sm:grid-cols-2">
            <x-ui.input
                label="Name"
                id="name"
                name="name"
                type="text"
                :value="old('name')"
                placeholder="Your name"
            />
            <x-ui.input
                label="Email"
                id="email"
                name="email"
                type="email"
                :value="old('email')"
                placeholder="you@example.com"
            />
        </div>
        <x-ui.input
            label="Subject"
            id="subject"
            name="subject"
            type="text"
            :value="old('subject')"
            placeholder="What's this about?"
        />
        <x-ui.textarea
            label="Message"
            id="message"
            name="message"
            rows="6"
            placeholder="Tell me what's on your mind..."
        >
            {{ old('message') }}</x-ui.textarea
        >
        <x-ui.button type="submit" size="lg">
            Send message
            <x-icons.arrow-right class="size-4" />
        </x-ui.button>
    </form>
</div>
