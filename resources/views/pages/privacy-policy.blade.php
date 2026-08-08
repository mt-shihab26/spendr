<x-layouts.legal
    title="Privacy Policy — {{ config('app.name') }}"
    description="Learn how {{ config('app.name') }} collects, uses, and protects your personal information."
    heading="Privacy Policy"
>
    <x-screens.legal.paragraph>
        At {{ config('app.name') }}, we take your privacy seriously. This
        Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our personal finance tracking service.
        Please read this policy carefully.
    </x-screens.legal.paragraph>

    <x-screens.legal.section heading="1. Information We Collect">
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <p><strong class="text-foreground">Account Information:</strong> When you register, we collect your name, email address, and password.</p>
            <p><strong class="text-foreground">Financial Data:</strong> We collect the transaction records, budget details, wallet balances, savings goals, and categories you enter into the app. This data is provided entirely by you and is never sourced from your bank automatically.</p>
            <p><strong class="text-foreground">Usage Data:</strong> We collect information about how you interact with the service, including log data, browser type, pages visited, and timestamps.</p>
            <p><strong class="text-foreground">Device Information:</strong> We may collect information about the device you use to access {{ config('app.name') }}, including IP address and operating system.</p>
        </div>
    </x-screens.legal.section>

    <x-screens.legal.section heading="2. How We Use Your Information">
        <x-screens.legal.list>
            <li>
                Provide, operate, and maintain the {{ config('app.name') }} service
            </li>
            <li>
                Process transactions and send related information, including
                subscription confirmations
            </li>
            <li>
                Respond to your comments and questions and provide customer
                support
            </li>
            <li>
                Send you technical notices, updates, security alerts, and
                administrative messages
            </li>
            <li>
                Monitor and analyse trends, usage, and activities to improve the
                service
            </li>
            <li>
                Detect, investigate, and prevent fraudulent transactions and
                other illegal activities
            </li>
        </x-screens.legal.list>
    </x-screens.legal.section>

    <x-screens.legal.section heading="3. Data Storage and Security">
        <x-screens.legal.paragraph>
            Your data is stored on secure servers. We implement
            industry-standard security measures including encryption in transit
            (TLS) and at rest, access controls, and regular security reviews.
            While we strive to protect your information, no method of
            transmission over the internet is 100% secure.
        </x-screens.legal.paragraph>
        <x-screens.legal.paragraph class="mt-4">
            We retain your data for as long as your account is active or as
            needed to provide services. You may delete your account and all
            associated data at any time from your account settings.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="4. Third-Party Services">
        <x-screens.legal.paragraph>
            We use trusted third-party services to operate {{ config('app.name') }},
            including payment processors and infrastructure providers. These
            parties have access only to the information necessary to perform
            their specific functions and are obligated not to disclose or use it
            for any other purpose. We do not sell your personal information to
            third parties.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="5. Your Rights">
        <x-screens.legal.list>
            <li>
                <strong class="text-foreground">Access:</strong> You may request
                a copy of the personal data we hold about you.
            </li>
            <li>
                <strong class="text-foreground">Correction:</strong> You may
                update or correct your information at any time in your account
                settings.
            </li>
            <li>
                <strong class="text-foreground">Deletion:</strong> You may
                request deletion of your account and all associated data.
            </li>
            <li>
                <strong class="text-foreground">Portability:</strong> You may
                export your financial data from the Data section of your
                settings.
            </li>
            <li>
                <strong class="text-foreground">Objection:</strong> You may
                object to our processing of your data in certain circumstances.
            </li>
        </x-screens.legal.list>
    </x-screens.legal.section>

    <x-screens.legal.section heading="6. Cookies">
        <x-screens.legal.paragraph>
            We use cookies and similar tracking technologies to maintain your
            session and preferences. For full details on how we use cookies,
            please read our
            <a
                href="{{ route('cookie-policy') }}"
                class="text-primary underline underline-offset-4 hover:opacity-80"
                >Cookie Policy</a
            >.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="7. Changes to This Policy">
        <x-screens.legal.paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the "Last updated" date. Your continued use of {{ config('app.name') }} after
            any changes constitutes your acceptance of the updated policy.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="8. Contact Us">
        <x-screens.legal.paragraph>
            If you have questions about this Privacy Policy or your personal
            data, please contact us at
            <a
                href="mailto:{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}"
                class="text-primary underline underline-offset-4 hover:opacity-80"
                >{{ 'privacy@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a
            >.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>
</x-layouts.legal>
