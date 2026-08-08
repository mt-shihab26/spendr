<x-layouts.legal
    title="Cookie Policy — {{ config('app.name') }}"
    description="Understand how {{ config('app.name') }} uses cookies and how you can manage your preferences."
    heading="Cookie Policy"
>
    <x-screens.legal.paragraph>
        This Cookie Policy explains how {{ config('app.name') }} uses cookies
        and similar tracking technologies when you visit our website or use our
        service. It should be read alongside our
        <a
            href="{{ route('privacy-policy') }}"
            class="text-primary underline underline-offset-4 hover:opacity-80"
            >Privacy Policy</a
        >.
    </x-screens.legal.paragraph>

    <x-screens.legal.section heading="1. What Are Cookies?">
        <x-screens.legal.paragraph>
            Cookies are small text files placed on your device when you visit a
            website. They are widely used to make websites work efficiently, to
            remember your preferences, and to provide reporting information.
            Cookies set by us are called "first-party cookies". Cookies set by
            parties other than us are called "third-party cookies".
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="2. Types of Cookies We Use">
        <div class="space-y-4">
            <x-screens.legal.card heading="Strictly Necessary Cookies">
                These cookies are essential for the service to function and
                cannot be disabled. They are typically set in response to your
                actions, such as logging in or setting your preferences.
                Examples: session cookies, CSRF protection tokens,
                authentication cookies.
            </x-screens.legal.card>
            <x-screens.legal.card heading="Preference Cookies">
                These cookies remember your settings and preferences so you
                don't have to re-enter them each visit. Examples: your chosen
                theme (light or dark mode), language, and display preferences.
            </x-screens.legal.card>
            <x-screens.legal.card heading="Analytics Cookies">
                These cookies help us understand how visitors interact with our
                service by collecting and reporting aggregated, anonymised
                information. This helps us improve the experience for all users.
            </x-screens.legal.card>
        </div>
    </x-screens.legal.section>

    <x-screens.legal.section heading="3. How We Use Cookies">
        <x-screens.legal.list>
            <li>
                Authenticate you and keep your session active while you use the
                app
            </li>
            <li>Protect against cross-site request forgery (CSRF) attacks</li>
            <li>Remember your display preferences such as dark mode</li>
            <li>Analyse overall usage patterns to improve our features</li>
            <li>Maintain the security and integrity of the service</li>
        </x-screens.legal.list>
    </x-screens.legal.section>

    <x-screens.legal.section heading="4. Third-Party Cookies">
        <x-screens.legal.paragraph>
            Some pages may include content from third-party services (such as
            payment providers). These third parties may set their own cookies.
            We do not control these cookies and they are subject to the
            respective third party's privacy and cookie policies. We do not
            share your personal financial data with any advertising networks.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="5. Managing Cookies">
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <x-screens.legal.paragraph>
                You can control and manage cookies through your browser
                settings. Most browsers allow you to refuse or delete cookies.
                Please note that disabling strictly necessary cookies will
                prevent you from logging in or using the app properly.
            </x-screens.legal.paragraph>
            <x-screens.legal.list>
                <li>
                    Chrome: Settings → Privacy and security → Cookies and other
                    site data
                </li>
                <li>
                    Firefox: Settings → Privacy & Security → Cookies and Site
                    Data
                </li>
                <li>Safari: Preferences → Privacy → Manage Website Data</li>
                <li>Edge: Settings → Cookies and site permissions</li>
            </x-screens.legal.list>
        </div>
    </x-screens.legal.section>

    <x-screens.legal.section heading="6. Changes to This Policy">
        <x-screens.legal.paragraph>
            We may update this Cookie Policy from time to time to reflect
            changes in technology or regulations. The "Last updated" date at the
            top of this page will be revised accordingly. We encourage you to
            review this policy periodically.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="7. Contact Us">
        <x-screens.legal.paragraph>
            If you have questions about our use of cookies, please contact us at
            <a
                href="mailto:{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}"
                class="text-primary underline underline-offset-4 hover:opacity-80"
                >{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a
            >.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>
</x-layouts.legal>
