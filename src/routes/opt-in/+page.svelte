<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Seo from '$lib/Seo.svelte';

  let phoneNumber = $state('');
  let agreed = $state(false);
  let errorMessage = $state('');
  let submitted = $state(false);
  let sending = $state(false);

  function validatePhoneNumber(): boolean {
    const phoneRegex = /^[+]?[0-9]{10,15}$/; // Supports international and local formats
    if (!phoneRegex.test(phoneNumber)) {
      errorMessage = 'Invalid phone number format!';
      return false;
    } else {
      errorMessage = '';
      return true;
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!agreed) {
      errorMessage = 'You must agree to receive messages before submitting.';
      return;
    }
    if (!validatePhoneNumber()) {
      return;
    }

    sending = true;
    errorMessage = '';

    try {
      const response = await fetch('https://www.clearbyte.com/api/sms-opt-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, agreed }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      // Only confirm once the opt-in was actually recorded.
      submitted = true;
    } catch (error) {
      console.error('Error:', error);
      errorMessage = 'There was a problem with your submission. Please try again.';
    } finally {
      sending = false;
    }
  }
</script>

<Seo
  title="SMS Opt-in"
  description="Opt in to receive Clearbyte SMS notifications about the launch and execution of AWS lab activities. Message and data rates may apply. Reply STOP to opt out, HELP for help."
/>

<Section>
  <Container width="readable">
    <h1 class="text-h1">Clearbyte SMS alerts</h1>
    <p class="mt-4 text-lead text-base-content/70">
      Opt in to receive notifications from Clearbyte about the launching and
      execution of your AWS lab activities.
    </p>

    <!-- Program disclosures. Carriers require these to be visible at the point
         of consent, not buried in the terms. -->
    <dl class="mt-8 grid gap-4 rounded-box border border-base-300 bg-base-200 p-6 sm:grid-cols-2">
      <div>
        <dt class="text-sm font-semibold">Program</dt>
        <dd class="mt-1 text-sm text-base-content/70">
          Clearbyte AWS lab activity alerts
        </dd>
      </div>
      <div>
        <dt class="text-sm font-semibold">Message frequency</dt>
        <dd class="mt-1 text-sm text-base-content/70">
          Varies with your lab activity, typically a few messages per lab.
        </dd>
      </div>
      <div>
        <dt class="text-sm font-semibold">Cost</dt>
        <dd class="mt-1 text-sm text-base-content/70">
          Message and data rates may apply.
        </dd>
      </div>
      <div>
        <dt class="text-sm font-semibold">Help &amp; opt-out</dt>
        <dd class="mt-1 text-sm text-base-content/70">
          Reply <strong>HELP</strong> for help, <strong>STOP</strong> to cancel.
        </dd>
      </div>
    </dl>

    <div class="mt-8 rounded-box border border-base-300 bg-base-100 p-6 shadow-card sm:p-8">
      {#if submitted}
        <div class="alert alert-success">
          <span>
            Thank you. You may opt out at any time by replying STOP, or reply
            HELP for help.
          </span>
        </div>
        <a href="/" class="btn btn-primary mt-6">Go home</a>
      {:else}
        {#if errorMessage}
          <div class="alert alert-error mb-6">
            <span>{errorMessage}</span>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-5">
          <div>
            <label class="label" for="phone">
              <span class="label-text">Mobile phone number</span>
            </label>
            <input
              type="tel"
              id="phone"
              pattern="[0-9]*"
              minlength="10"
              maxlength="10"
              title="Must be 10 digits"
              bind:value={phoneNumber}
              placeholder="Enter your mobile number"
              class="input input-bordered w-full tabular-nums"
              required
            />
            <span class="mt-1 block text-sm text-base-content/60">Must be 10 digits</span>
          </div>

          <!-- Unchecked by default, and the only thing this form does. Consent
               is never bundled into the terms or required for anything else. -->
          <div class="flex items-start gap-3 rounded-field bg-base-200 p-4">
            <input
              type="checkbox"
              id="consent"
              bind:checked={agreed}
              class="checkbox checkbox-primary mt-0.5"
              required
            />
            <label class="text-sm text-base-content/80" for="consent">
              I agree to receive SMS messages from Clearbyte about my AWS lab
              activities at the number provided. Message frequency varies.
              Message and data rates may apply. Reply HELP for help, STOP to
              cancel. See our
              <a class="text-primary hover:underline" href="/privacy">privacy policy</a>
              and
              <a class="text-primary hover:underline" href="/terms">terms &amp; conditions</a>.
            </label>
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={sending}>
            {sending ? 'Submitting...' : 'Opt in to SMS alerts'}
          </button>

          <p class="text-sm text-base-content/60">
            Consent to receive text messages is not a condition of using
            Clearbyte. We do not sell or share your number.
          </p>
        </form>
      {/if}
    </div>
  </Container>
</Section>
