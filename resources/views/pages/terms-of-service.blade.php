<x-layouts.legal
    title="Terms of Service — {{ config('app.name') }}"
    description="Read the terms and conditions governing your use of {{ config('app.name') }}."
    heading="Terms of Service"
>
    <x-screens.legal.paragraph>
        Please read these Terms of Service carefully before using {{ config('app.name') }}. By accessing or
        using the service, you agree to be bound by these terms. If you do not agree, do not use the service.
    </x-screens.legal.paragraph>

    <x-screens.legal.section heading="1. Acceptance of Terms">
        <x-screens.legal.paragraph>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and
            {{ config('app.name') }} ("we", "us", or "our"). By creating an account or using any part of
            the service, you confirm that you are at least 18 years old and have the legal capacity to
            enter into this agreement.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="2. Use of Service">
        <x-screens.legal.paragraph class="mb-4">
            {{ config('app.name') }} provides personal finance tracking tools for individual, non-commercial use.
            You agree to use the service only for lawful purposes and in accordance with these Terms.
            You must not:
        </x-screens.legal.paragraph>
        <x-screens.legal.list>
            <li>Use the service to store, transmit, or process any illegal financial activity</li>
            <li>Attempt to gain unauthorised access to any part of the service or its infrastructure</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the service</li>
            <li>Use automated means to scrape, crawl, or extract data from the service</li>
            <li>Impersonate any person or entity or misrepresonate your affiliation</li>
        </x-screens.legal.list>
    </x-screens.legal.section>

    <x-screens.legal.section heading="3. Account Responsibility">
        <x-screens.legal.paragraph>
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activity that occurs under your account. You agree to notify us immediately of any
            unauthorised use of your account. We are not liable for any loss or damage arising from your
            failure to protect your credentials.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="4. Subscription and Billing">
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <p>{{ config('app.name') }} offers a free trial period followed by paid subscription plans. By subscribing, you authorise us to charge the applicable fees to your payment method on a recurring basis.</p>
            <p>Subscription fees are billed in advance for each billing cycle. All charges are non-refundable except as outlined in our <a href="{{ route('refund-policy') }}" class="text-primary underline underline-offset-4 hover:opacity-80">Refund Policy</a>.</p>
            <p>We reserve the right to change pricing with reasonable notice. Continued use of the service after a price change constitutes acceptance of the new pricing.</p>
        </div>
    </x-screens.legal.section>

    <x-screens.legal.section heading="5. Your Data">
        <x-screens.legal.paragraph>
            You retain ownership of all financial data you enter into {{ config('app.name') }}. By using the service,
            you grant us a limited licence to store, process, and display your data solely for the purpose
            of operating the service. We do not claim ownership of your data and will never sell it to third parties.
            You may export or delete your data at any time.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="6. Intellectual Property">
        <x-screens.legal.paragraph>
            The {{ config('app.name') }} name, logo, software, design, and all related content are the exclusive
            property of {{ config('app.name') }} and are protected by copyright and other intellectual property laws.
            Nothing in these Terms transfers any ownership rights to you.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="7. Disclaimer of Warranties">
        <x-screens.legal.paragraph>
            {{ config('app.name') }} is provided "as is" without warranties of any kind, express or implied.
            We do not warrant that the service will be uninterrupted, error-free, or completely secure.
            {{ config('app.name') }} is a budgeting tool and does not provide financial, investment, tax, or legal advice.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="8. Limitation of Liability">
        <x-screens.legal.paragraph>
            To the maximum extent permitted by law, {{ config('app.name') }} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of, or inability
            to use, the service, even if we have been advised of the possibility of such damages. Our total
            liability to you shall not exceed the amounts paid by you in the twelve months prior to the claim.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="9. Termination">
        <x-screens.legal.paragraph>
            Either party may terminate this agreement at any time. You may cancel your subscription and
            delete your account from your settings. We reserve the right to suspend or terminate your
            access for violation of these Terms, with or without notice. Upon termination, your right to
            use the service ceases immediately.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="10. Governing Law">
        <x-screens.legal.paragraph>
            These Terms shall be governed by and construed in accordance with applicable laws. Any dispute
            arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="11. Changes to Terms">
        <x-screens.legal.paragraph>
            We may modify these Terms at any time. We will provide notice of material changes via email
            or a prominent notice within the service. Your continued use after the effective date of
            changes constitutes acceptance of the revised Terms.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>

    <x-screens.legal.section heading="12. Contact Us">
        <x-screens.legal.paragraph>
            For questions about these Terms, contact us at
            <a href="mailto:{{ 'legal@' . parse_url(config('app.url'), PHP_URL_HOST) }}" class="text-primary underline underline-offset-4 hover:opacity-80">{{ 'legal@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a>.
        </x-screens.legal.paragraph>
    </x-screens.legal.section>
</x-layouts.legal>
