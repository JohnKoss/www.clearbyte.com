<script lang="ts">
    let phoneNumber = $state("");
    let agreed = $state(false);
  
    function handleSubmit(event: Event) {
      event.preventDefault();
      if (!agreed) {
        alert("You must agree to receive messages before submitting.");
        return;
      }
  
      console.log("User opted in:", { phoneNumber, agreed });
      alert("Thank you for opting in! You will receive AWS-related messages.");
    }
  </script>
  
  <section class="min-h-screen flex items-center justify-center p-6">
    <div class="card w-full max-w-lg bg-base-100 shadow-xl p-6">
      <h2 class="text-2xl font-semibold text-primary">Get SMS Alerts</h2>
      <p class="text-gray-500 mb-4">Sign up to receive important ClearByte notifications and updates regarding the launching/execution of the AWS lab activity process.</p>
  
      <form onsubmit={handleSubmit} class="space-y-4">
        <!-- Phone Number Input -->
        <div>
          <label class="label" for="phone">
            <span class="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            id="phone"
            bind:value={phoneNumber}
            placeholder="Enter your phone number"
            class="input input-bordered w-full"
            required
          />
        </div>
  
        <!-- Explicit Opt-in Checkbox -->
        <div class="flex items-start space-x-2">
          <input type="checkbox" bind:checked={agreed} class="checkbox checkbox-primary" required />
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="text-sm text-gray-600">
            I consent to receive ClearByte-related messages. Message & data rates may apply. Reply STOP to opt-out.
          </label>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-full">Subscribe</button>
      </form>
    </div>
  </section>
  