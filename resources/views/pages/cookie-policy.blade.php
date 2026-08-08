<x-layouts.legal
    title="Cookie Policy — {{ config('app.name') }}"
    description="Understand how {{ config('app.name') }} uses cookies and how you can manage your preferences."
    heading="Cookie Policy"
>
    <p class="leading-relaxed text-muted-foreground">
        This Cookie Policy explains how {{ config('app.name') }} uses cookies and similar tracking technologies
        when you visit our website or use our service. It should be read alongside our
        <a href="{{ route('privacy-policy') }}" class="text-primary underline underline-offset-4 hover:opacity-80">Privacy Policy</a>.
    </p>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">1. What Are Cookies?</h2>
        <p class="leading-relaxed text-muted-foreground">
            Cookies are small text files placed on your device when you visit a website. They are widely
            used to make websites work efficiently, to remember your preferences, and to provide reporting
            information. Cookies set by us are called "first-party cookies". Cookies set by parties other
            than us are called "third-party cookies".
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">2. Types of Cookies We Use</h2>
        <div class="space-y-4">
            <div class="rounded-lg border border-border p-5">
                <h3 class="mb-2 font-semibold text-foreground">Strictly Necessary Cookies</h3>
                <p class="text-sm leading-relaxed text-muted-foreground">
                    These cookies are essential for the service to function and cannot be disabled. They are
                    typically set in response to your actions, such as logging in or setting your preferences.
                    Examples: session cookies, CSRF protection tokens, authentication cookies.
                </p>
            </div>
            <div class="rounded-lg border border-border p-5">
                <h3 class="mb-2 font-semibold text-foreground">Preference Cookies</h3>
                <p class="text-sm leading-relaxed text-muted-foreground">
                    These cookies remember your settings and preferences so you don't have to re-enter them
                    each visit. Examples: your chosen theme (light or dark mode), language, and display preferences.
                </p>
            </div>
            <div class="rounded-lg border border-border p-5">
                <h3 class="mb-2 font-semibold text-foreground">Analytics Cookies</h3>
                <p class="text-sm leading-relaxed text-muted-foreground">
                    These cookies help us understand how visitors interact with our service by collecting
                    and reporting aggregated, anonymised information. This helps us improve the experience
                    for all users.
                </p>
            </div>
        </div>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">3. How We Use Cookies</h2>
        <ul class="list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Authenticate you and keep your session active while you use the app</li>
            <li>Protect against cross-site request forgery (CSRF) attacks</li>
            <li>Remember your display preferences such as dark mode</li>
            <li>Analyse overall usage patterns to improve our features</li>
            <li>Maintain the security and integrity of the service</li>
        </ul>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">4. Third-Party Cookies</h2>
        <p class="leading-relaxed text-muted-foreground">
            Some pages may include content from third-party services (such as payment providers).
            These third parties may set their own cookies. We do not control these cookies and they are
            subject to the respective third party's privacy and cookie policies. We do not share your
            personal financial data with any advertising networks.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">5. Managing Cookies</h2>
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <p>
                You can control and manage cookies through your browser settings. Most browsers allow you
                to refuse or delete cookies. Please note that disabling strictly necessary cookies will
                prevent you from logging in or using the app properly.
            </p>
            <ul class="list-disc space-y-1 pl-5">
                <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                <li>Safari: Preferences → Privacy → Manage Website Data</li>
                <li>Edge: Settings → Cookies and site permissions</li>
            </ul>
        </div>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">6. Changes to This Policy</h2>
        <p class="leading-relaxed text-muted-foreground">
            We may update this Cookie Policy from time to time to reflect changes in technology or
            regulations. The "Last updated" date at the top of this page will be revised accordingly.
            We encourage you to review this policy periodically.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">7. Contact Us</h2>
        <p class="leading-relaxed text-muted-foreground">
            If you have questions about our use of cookies, please contact us at
            <a href="mailto:{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}" class="text-primary underline underline-offset-4 hover:opacity-80">{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a>.
        </p>
    </section>
</x-layouts.legal>
