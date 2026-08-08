<x-layouts.legal
    title="Terms of Service — {{ config('app.name') }}"
    description="Read the terms and conditions governing your use of {{ config('app.name') }}."
    heading="Terms of Service"
>
    <p class="leading-relaxed text-muted-foreground">
        Please read these Terms of Service carefully before using {{ config('app.name') }}. By accessing or
        using the service, you agree to be bound by these terms. If you do not agree, do not use the service.
    </p>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p class="leading-relaxed text-muted-foreground">
            These Terms of Service ("Terms") constitute a legally binding agreement between you and
            {{ config('app.name') }} ("we", "us", or "our"). By creating an account or using any part of
            the service, you confirm that you are at least 18 years old and have the legal capacity to
            enter into this agreement.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">2. Use of Service</h2>
        <p class="mb-4 leading-relaxed text-muted-foreground">
            {{ config('app.name') }} provides personal finance tracking tools for individual, non-commercial use.
            You agree to use the service only for lawful purposes and in accordance with these Terms.
            You must not:
        </p>
        <ul class="list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Use the service to store, transmit, or process any illegal financial activity</li>
            <li>Attempt to gain unauthorised access to any part of the service or its infrastructure</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the service</li>
            <li>Use automated means to scrape, crawl, or extract data from the service</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
        </ul>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">3. Account Responsibility</h2>
        <p class="leading-relaxed text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activity that occurs under your account. You agree to notify us immediately of any
            unauthorised use of your account. We are not liable for any loss or damage arising from your
            failure to protect your credentials.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">4. Subscription and Billing</h2>
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <p>{{ config('app.name') }} offers a free trial period followed by paid subscription plans. By subscribing, you authorise us to charge the applicable fees to your payment method on a recurring basis.</p>
            <p>Subscription fees are billed in advance for each billing cycle. All charges are non-refundable except as outlined in our <a href="{{ route('refund-policy') }}" class="text-primary underline underline-offset-4 hover:opacity-80">Refund Policy</a>.</p>
            <p>We reserve the right to change pricing with reasonable notice. Continued use of the service after a price change constitutes acceptance of the new pricing.</p>
        </div>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">5. Your Data</h2>
        <p class="leading-relaxed text-muted-foreground">
            You retain ownership of all financial data you enter into {{ config('app.name') }}. By using the service,
            you grant us a limited licence to store, process, and display your data solely for the purpose
            of operating the service. We do not claim ownership of your data and will never sell it to third parties.
            You may export or delete your data at any time.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">6. Intellectual Property</h2>
        <p class="leading-relaxed text-muted-foreground">
            The {{ config('app.name') }} name, logo, software, design, and all related content are the exclusive
            property of {{ config('app.name') }} and are protected by copyright and other intellectual property laws.
            Nothing in these Terms transfers any ownership rights to you.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
        <p class="leading-relaxed text-muted-foreground">
            {{ config('app.name') }} is provided "as is" without warranties of any kind, express or implied.
            We do not warrant that the service will be uninterrupted, error-free, or completely secure.
            {{ config('app.name') }} is a budgeting tool and does not provide financial, investment, tax, or legal advice.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
        <p class="leading-relaxed text-muted-foreground">
            To the maximum extent permitted by law, {{ config('app.name') }} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of, or inability
            to use, the service, even if we have been advised of the possibility of such damages. Our total
            liability to you shall not exceed the amounts paid by you in the twelve months prior to the claim.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">9. Termination</h2>
        <p class="leading-relaxed text-muted-foreground">
            Either party may terminate this agreement at any time. You may cancel your subscription and
            delete your account from your settings. We reserve the right to suspend or terminate your
            access for violation of these Terms, with or without notice. Upon termination, your right to
            use the service ceases immediately.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">10. Governing Law</h2>
        <p class="leading-relaxed text-muted-foreground">
            These Terms shall be governed by and construed in accordance with applicable laws. Any dispute
            arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">11. Changes to Terms</h2>
        <p class="leading-relaxed text-muted-foreground">
            We may modify these Terms at any time. We will provide notice of material changes via email
            or a prominent notice within the service. Your continued use after the effective date of
            changes constitutes acceptance of the revised Terms.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">12. Contact Us</h2>
        <p class="leading-relaxed text-muted-foreground">
            For questions about these Terms, contact us at
            <a href="mailto:{{ 'legal@' . parse_url(config('app.url'), PHP_URL_HOST) }}" class="text-primary underline underline-offset-4 hover:opacity-80">{{ 'legal@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a>.
        </p>
    </section>
</x-layouts.legal>
