<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Prose from '$lib/Prose.svelte';
  import Seo from '$lib/Seo.svelte';
</script>

<Seo
  title="SMS Privacy Policy"
  description="How Clearbyte collects, uses and protects your mobile number for SMS notifications."
/>

<Section>
  <Container width="readable">
    <h1 class="text-h1">Clearbyte SMS Privacy Policy</h1>
    <p class="mt-3 text-base-content/70">Effective Date: {new Date().getFullYear()}</p>

    <div class="mt-10">
      <Prose>
        <h2>1. Information We Collect</h2>
        <p>
          When you opt-in to receive SMS messages from Clearbyte, we collect your mobile phone number and any preferences
          related to communications. We do not share or sell your phone number to third parties.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          Clearbyte uses your phone number to send important updates, AWS lab notifications, and other relevant messages.
          These messages may include service updates, reminders, or promotional content. Message frequency may vary.
        </p>

        <h2>3. Opt-In and Consent</h2>
        <p>
          By providing your phone number and opting in to receive messages, you consent to receive SMS notifications from Clearbyte.
          Standard message and data rates may apply.
        </p>

        <h2>4. Opt-Out and Unsubscribe</h2>
        <p>
          You may opt out of receiving SMS messages at any time by replying <strong>STOP</strong> to any message.
          Once you opt out, you will no longer receive further messages unless you opt in again.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your phone number and personal information. However,
          no system is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          We may use third-party SMS providers to send messages. These providers are required to maintain the confidentiality
          and security of your information.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this SMS Privacy Policy from time to time. Any changes will be posted on this page with an updated
          effective date.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this SMS Privacy Policy, you can contact us at:
        </p>
        <p><strong>Email: info@clearbyte.com</strong></p>
      </Prose>
    </div>
  </Container>
</Section>
