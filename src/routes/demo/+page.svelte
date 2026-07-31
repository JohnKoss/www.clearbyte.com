<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';

  let name = $state('');
  let institution = $state('');
  let email = $state('');
  let course = $state('');
  let seats = $state('');
  let lab = $state('');
  let notes = $state('');

  let submitted = $state(false);
  let sending = $state(false);
  let errorMessage = $state('');

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!name || !institution || !email || !course) {
      errorMessage = 'Name, institution, email and course are all required.';
      return;
    }

    sending = true;
    errorMessage = '';

    // Composed into the message field so this works against the existing
    // contact endpoint. Phase 5 swaps it for a dedicated demo_request lambda.
    const message = [
      `Institution: ${institution}`,
      `Course / term: ${course}`,
      `Seats: ${seats || 'not specified'}`,
      `Lab of interest: ${lab || 'not specified'}`,
      '',
      notes || '(no additional notes)',
    ].join('\n');

    try {
      const response = await fetch('https://www.clearbyte.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      submitted = true;
    } catch (error) {
      console.error('Error:', error);
      errorMessage = 'There was a problem sending your request. Please try again.';
    } finally {
      sending = false;
    }
  }
</script>

<Seo
  title="Request an instructor demo"
  description="Request a demo of Clearbyte's hands-on AWS labs for your course. Demo seats are provisioned per request."
/>

<Section>
  <Container>
    <div class="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 class="text-h1">Request an instructor demo</h1>
        <p class="mt-4 text-lead text-base-content/70">
          Tell us what you teach and we'll set up demo seats matched to your
          course. Your students get the real lab &mdash; a live AWS account,
          launched from Canvas, graded automatically.
        </p>

        <ul class="mt-8 space-y-4">
          <li class="flex gap-3">
            <span aria-hidden="true" class="text-accent">&#10003;</span>
            <span class="text-base-content/80">
              Seats are provisioned per request, so there is nothing for
              students to sign up for.
            </span>
          </li>
          <li class="flex gap-3">
            <span aria-hidden="true" class="text-accent">&#10003;</span>
            <span class="text-base-content/80">
              We match the lab to what you are teaching.
            </span>
          </li>
          <li class="flex gap-3">
            <span aria-hidden="true" class="text-accent">&#10003;</span>
            <span class="text-base-content/80">
              Accounts are destroyed when the lab ends.
            </span>
          </li>
        </ul>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-6 shadow-card sm:p-8">
        {#if submitted}
          <div class="alert alert-success">
            <span>Thanks &mdash; your request is in. We'll be in touch shortly.</span>
          </div>
          <a href="/labs" class="btn btn-primary mt-6">Browse the lab catalog</a>
        {:else}
          {#if errorMessage}
            <div class="alert alert-error mb-6">
              <span>{errorMessage}</span>
            </div>
          {/if}

          <form onsubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="label" for="name"><span class="label-text">Your name</span></label>
              <input id="name" bind:value={name} class="input input-bordered w-full" required />
            </div>

            <div>
              <label class="label" for="institution"><span class="label-text">Institution</span></label>
              <input id="institution" bind:value={institution} class="input input-bordered w-full" required />
            </div>

            <div>
              <label class="label" for="email"><span class="label-text">Work email</span></label>
              <input id="email" type="email" bind:value={email} class="input input-bordered w-full" required />
            </div>

            <div>
              <label class="label" for="course"><span class="label-text">Course &amp; term</span></label>
              <input
                id="course"
                bind:value={course}
                placeholder="e.g. ITNC 2050, Fall 2026"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label class="label" for="seats"><span class="label-text">Approximate seats</span></label>
              <input id="seats" type="number" min="1" bind:value={seats} class="input input-bordered w-full" />
            </div>

            <div>
              <label class="label" for="lab"><span class="label-text">Lab of interest</span></label>
              <select id="lab" bind:value={lab} class="select select-bordered w-full">
                <option value="">No preference</option>
                {#each labs as l (l.slug)}
                  <option value={l.title}>{l.title}</option>
                {/each}
              </select>
            </div>

            <div>
              <label class="label" for="notes"><span class="label-text">Anything else?</span></label>
              <textarea id="notes" bind:value={notes} rows="3" class="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-full" disabled={sending}>
              {sending ? 'Sending...' : 'Request demo'}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </Container>
</Section>
