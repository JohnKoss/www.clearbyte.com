<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Prose from '$lib/Prose.svelte';
  import Seo from '$lib/Seo.svelte';
</script>

<Seo
  title="Terms &amp; Conditions"
  description="The terms and conditions governing use of Clearbyte's AWS lab services."
/>

<Section>
  <Container width="readable">
    <h1 class="text-h1">Clearbyte Terms &amp; Conditions</h1>
    <p class="mt-3 text-base-content/70">Effective Date: {new Date().getFullYear()}</p>

    <div class="mt-10">
      <Prose>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Clearbyte. By accessing our services, you agree to these Terms &amp; Conditions.
          If you do not agree with any part of these terms, please do not use our services.
        </p>

        <h2>2. Use of Our Services</h2>
        <p>
          You must use our AWS labs and related services only for lawful purposes. Any unauthorized use,
          including but not limited to hacking, unauthorized access, or any fraudulent activity, is prohibited.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. Any unauthorized
          use of your account must be reported immediately to Clearbyte.
        </p>

        <h2>4. Payments and Subscriptions</h2>
        <p>
          If our services require payment, you agree to provide accurate payment information and authorize
          us to charge applicable fees. Payments are non-refundable except as required by law.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All content, including text, images, software, and trademarks, are owned by Clearbyte or licensed
          for use. You may not copy, distribute, or modify our content without explicit permission.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          Clearbyte is not liable for any direct, indirect, incidental, or consequential damages arising from
          the use of our services, except as required by law.
        </p>

        <h2>7. Termination of Services</h2>
        <p>
          We reserve the right to suspend or terminate your access to our services at any time if you violate
          these Terms &amp; Conditions.
        </p>

        <h2>8. Changes to These Terms</h2>
        <p>
          We may update these Terms &amp; Conditions at any time. The latest version will always be available on
          our website. Continued use of our services means you accept any updates.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms &amp; Conditions are governed by and interpreted according to the laws of [Your Jurisdiction].
          Any disputes will be resolved in the appropriate courts of this jurisdiction.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding these Terms &amp; Conditions, please contact us:
        </p>
        <p><strong>Email: info@clearbyte.com</strong></p>
      </Prose>
    </div>
  </Container>
</Section>
