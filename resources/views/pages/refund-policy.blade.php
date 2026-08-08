<x-layouts.legal
    title="Refund Policy — {{ config('app.name') }}"
    description="Learn about {{ config('app.name') }}'s refund and cancellation policy."
    heading="Refund Policy"
>
    <p class="leading-relaxed text-muted-foreground">
        We want you to be completely satisfied with {{ config('app.name') }}. This Refund Policy explains
        your options if you are not happy with your subscription.
    </p>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">1. Free Trial</h2>
        <p class="leading-relaxed text-muted-foreground">
            {{ config('app.name') }} offers a {{ config('pricing.trial_days') }}-day free trial with no credit card required.
            You will not be charged during the trial period. If you choose not to subscribe after your trial
            ends, your account will simply be downgraded and no charges will be made.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">2. Subscription Cancellation</h2>
        <p class="leading-relaxed text-muted-foreground">
            You may cancel your subscription at any time from your account settings. Upon cancellation,
            you will retain access to paid features until the end of your current billing period. We do
            not charge cancellation fees.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">3. Refund Eligibility</h2>
        <div class="space-y-4 leading-relaxed text-muted-foreground">
            <p>We offer refunds in the following circumstances:</p>
            <ul class="list-disc space-y-2 pl-5">
                <li><strong class="text-foreground">30-day money-back guarantee:</strong> If you are not satisfied within 30 days of your first paid subscription charge, contact us for a full refund.</li>
                <li><strong class="text-foreground">Duplicate charges:</strong> If you were charged more than once for the same billing period, we will refund the duplicate amount immediately.</li>
                <li><strong class="text-foreground">Service outages:</strong> If {{ config('app.name') }} experiences extended downtime (more than 24 continuous hours) that we caused, you may be eligible for a pro-rated credit.</li>
            </ul>
            <p>Refunds are not available for partial months, plan downgrades, or unused portions of a subscription period outside of the 30-day window.</p>
        </div>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">4. How to Request a Refund</h2>
        <p class="leading-relaxed text-muted-foreground">
            To request a refund, contact our support team at
            <a href="mailto:{{ 'support@' . parse_url(config('app.url'), PHP_URL_HOST) }}" class="text-primary underline underline-offset-4 hover:opacity-80">{{ 'support@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a>
            with your account email and a brief description of the reason for your request. Please include
            "Refund Request" in the subject line.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">5. Processing Time</h2>
        <p class="leading-relaxed text-muted-foreground">
            Approved refunds are processed within 5–10 business days. The time for the funds to appear
            in your account depends on your payment provider and may take an additional 3–5 business days.
        </p>
    </section>

    <section>
        <h2 class="mb-4 text-xl font-semibold text-foreground">6. Contact Us</h2>
        <p class="leading-relaxed text-muted-foreground">
            If you have questions about our refund policy, please reach out to us at
            <a href="mailto:{{ 'support@' . parse_url(config('app.url'), PHP_URL_HOST) }}" class="text-primary underline underline-offset-4 hover:opacity-80">{{ 'support@' . parse_url(config('app.url'), PHP_URL_HOST) }}</a>.
            We are happy to help.
        </p>
    </section>
</x-layouts.legal>
