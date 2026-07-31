<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Seo from '$lib/Seo.svelte';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitted = $state(false);
  let sending = $state(false);
  let errorMessage = $state('');

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!name || !email || !message) {
      errorMessage = 'Please fill in all fields before submitting.';
      return;
    }

    sending = true;
    errorMessage = '';

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

<Seo
  title="Contact"
  description="Get in touch with Clearbyte about hands-on AWS lab activities for your course."
/>

<Section>
  <Container width="readable">
    <h1 class="text-h1">Contact us</h1>
    <p class="mt-4 text-lead text-base-content/70">
      Questions about the labs, pricing, or getting set up in Canvas? Send us a
      note.
    </p>

    <div class="mt-10 rounded-box border border-base-300 bg-base-100 p-6 shadow-card sm:p-8">
      {#if submitted}
        <div class="alert alert-success">
          <span>Your message has been sent. We will get back to you soon.</span>
        </div>
        <a href="/" class="btn btn-primary mt-6">Go home</a>
      {:else}
        {#if errorMessage}
          <div class="alert alert-error mb-6">
            <span>{errorMessage}</span>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="label" for="name">
              <span class="label-text">Your name</span>
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

          <div>
            <label class="label" for="email">
              <span class="label-text">Email address</span>
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

          <div>
            <label class="label" for="message">
              <span class="label-text">Message</span>
            </label>
            <textarea
              id="message"
              bind:value={message}
              placeholder="Type your message here..."
              class="textarea textarea-bordered w-full"
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={sending}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      {/if}
    </div>

    <p class="mt-6 text-sm text-base-content/60">
      Teaching a course and want to try a lab with students?
      <a class="text-primary hover:underline" href="/demo">Request an instructor demo</a>
      instead.
    </p>
  </Container>
</Section>
