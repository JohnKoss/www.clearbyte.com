<script lang="ts">
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

<section class="min-h-screen flex items-center justify-center p-6">
  <div class="card w-full max-w-lg bg-base-100 shadow-xl p-6">
    <h2 class="text-2xl font-semibold text-primary">Get SMS Alerts</h2>
    <p class="text-gray-500 mb-4">
      Sign up to receive important ClearByte notifications and updates regarding
      the launching/execution of the AWS lab activity process.
    </p>
    {#if submitted}
      <div class="alert alert-success mt-4">
        <span>✅ Thank you. You may can opt out at any time by replying STOP to the message.</span
        >
      </div>
      <a href="/" class="btn btn-primary mt-4">Go Home</a>
    {:else}
      {#if errorMessage}
        <div class="alert alert-error mb-4">
          <span>{errorMessage}</span>
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-4">
        <!-- Phone Number Input -->
        <div>
          <label class="label" for="phone">
            <span class="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            id="phone"
            pattern="[0-9]*"
            minlength="10"
            maxlength="10"
            title="Must be 10 digits"
            bind:value={phoneNumber}
            placeholder="Enter your phone number"
            class="input w-full validator tabular-nums"
            required
          />
          <label class="label validator-hint" for="phone">
            <span class="label-text">Must be 10 digits</span>
          </label>
        </div>

        <!-- Explicit Opt-in Checkbox -->
        <div class="flex items-start space-x-2">
          <input
            type="checkbox"
            bind:checked={agreed}
            class="checkbox checkbox-primary"
            required
          />
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="text-sm text-gray-600">
            I consent to receive ClearByte-related messages. Message & data
            rates may apply. Reply STOP to opt-out.
          </label>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-full" disabled={sending}>
          {sending ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>
    {/if}
  </div>
</section>
