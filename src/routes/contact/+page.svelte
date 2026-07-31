<script lang="ts">
    let name = $state("");
    let email = $state("");
    let message = $state("");
    let submitted = $state(false);
    let sending = $state(false);
    let errorMessage = $state("");

    async function handleSubmit(event: Event) {
      event.preventDefault();

      if (!name || !email || !message) {
        errorMessage = "Please fill in all fields before submitting.";
        return;
      }

      sending = true;
      errorMessage = "";

      try {
        const response = await fetch('https://www.clearbyte.com/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }

        // Only confirm once the message actually went through.
        submitted = true;
      } catch (error) {
        console.error('Error:', error);
        errorMessage = 'There was a problem sending your message. Please try again.';
      } finally {
        sending = false;
      }
    }

  </script>
  
  <section class="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200">
    <div class="card w-full max-w-lg bg-base-100 shadow-xl p-6">
      <h2 class="text-3xl font-bold text-primary text-center">Contact Us</h2>
      <p class="text-gray-500 text-center">We'd love to hear from you! Send us a message below.</p>
  
      {#if submitted}
        <div class="alert alert-success mt-4">
          <span>✅ Your message has been sent! We will get back to you soon.</span>
        </div>
        <a href="/" class="btn btn-primary mt-4">Go Home</a>
      {:else}
        {#if errorMessage}
          <div class="alert alert-error mt-4">
            <span>{errorMessage}</span>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-4 mt-4">
          <!-- Name Input -->
          <div>
            <label class="label" for="name">
              <span class="label-text">Your Name</span>
            </label>
            <input
              type="text"
              id="name"
              bind:value={name}
              placeholder="Enter your name"
              class="input input-bordered w-full"
              required
            />
          </div>
  
          <!-- Email Input -->
          <div>
            <label class="label" for="email">
              <span class="label-text">Email Address</span>
            </label>
            <input
              type="email"
              id="email"
              bind:value={email}
              placeholder="Enter your email"
              class="input input-bordered w-full"
              required
            />
          </div>
  
          <!-- Message Input -->
          <div>
            <label class="label" for="message">
              <span class="label-text">Message</span>
            </label>
            <textarea
              id="message"
              bind:value={message}
              placeholder="Type your message here..."
              class="textarea textarea-bordered w-full"
              rows="4"
              required
            ></textarea>
          </div>
  
          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-full" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      {/if}
    </div>
  </section>
  