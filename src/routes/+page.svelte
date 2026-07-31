<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import LabCard from '$lib/LabCard.svelte';
  import Picture from '$lib/Picture.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';

  const featured = labs.slice(0, 3);

  const steps = [
    {
      title: 'Build it from byte-size steps',
      body: 'Break a lab into small, ordered steps instead of one intimidating wall of instructions. More steps, each easier to finish.',
    },
    {
      title: 'Launch it from your LMS',
      body: 'Students open the lab from your course. LTI 1.3 handles sign-in, so there is no separate account for them to create.',
    },
    {
      title: 'Students work in real AWS',
      body: 'Every student gets credentials and console access to a live AWS account, not a simulator or a screenshot.',
    },
    {
      title: 'Grade it, then tear it down',
      body: 'Work is checked against what was actually built, the score returns to your gradebook, and the account is destroyed.',
    },
  ];
</script>

<Seo
  title="Byte-size AWS lab activities for schools"
  description="Clearbyte helps schools build hands-on AWS lab activities from byte-size steps, launched from your LMS, run in a live AWS account, and graded automatically."
/>

<!-- Hero -->
<Section>
  <Container>
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-accent">
          Hands-on cloud, a byte at a time
        </p>
        <h1 class="mt-3 text-h1">
          AWS lab activities your students can actually finish.
        </h1>
        <p class="mt-6 text-lead text-base-content/70">
          Clearbyte helps schools build hands-on AWS labs out of byte-size steps
          &mdash; more steps, each small enough to follow. Students work in a
          real AWS account, launched from your course, graded automatically.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/demo" class="btn btn-primary btn-lg">Request a demo</a>
          <a href="/labs" class="btn btn-outline btn-lg">Browse the labs</a>
        </div>
      </div>

      <!-- priority: this is the LCP image, so it loads eagerly. -->
      <div class="mx-auto w-full max-w-[600px] lg:mx-0">
        <Picture
          base="/person-at-computer"
          alt="A student working through a lab on a laptop"
          width={600}
          height={400}
          priority
          class="h-auto w-full rounded-box shadow-card"
        />
      </div>
    </div>
  </Container>
</Section>

<!-- How it works -->
<Section tone="muted">
  <Container>
    <h2 class="text-h2">How a lab comes together</h2>
    <p class="mt-3 max-w-readable text-base-content/70">
      The same four steps for every lab in the catalog.
    </p>

    <ol class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {#each steps as step, i (step.title)}
        <li class="rounded-box border border-base-300 bg-base-100 p-6">
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-selector bg-primary font-semibold text-primary-content"
          >
            {i + 1}
          </span>
          <h3 class="mt-4 font-semibold">{step.title}</h3>
          <p class="mt-2 text-sm text-base-content/70">{step.body}</p>
        </li>
      {/each}
    </ol>
  </Container>
</Section>

<!-- Why byte-size -->
<Section>
  <Container>
    <div class="max-w-readable">
      <h2 class="text-h2">Why byte-size steps</h2>
      <p class="mt-4 text-base-content/70">
        A long lab fails quietly. A student gets stuck on step 3, guesses at
        step 4, and by step 9 nothing works and nobody knows why. Breaking the
        same material into smaller steps means a student always knows whether
        the last thing they did worked &mdash; and so do you.
      </p>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Smaller steps, fewer dead ends</h3>
        <p class="mt-2 text-base-content/70">
          Each step is small enough to check before moving on.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Built for a class period</h3>
        <p class="mt-2 text-base-content/70">
          Sized to fit the time you actually have, not a corporate training
          calendar.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Real AWS, not a mock</h3>
        <p class="mt-2 text-base-content/70">
          Small steps, but the account and the credentials are the real thing.
        </p>
      </div>
    </div>
  </Container>
</Section>

<!-- Lab preview -->
<Section tone="muted">
  <Container>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-h2">From the lab catalog</h2>
        <p class="mt-3 max-w-readable text-base-content/70">
          Pick the ones that fit what you're covering.
        </p>
      </div>
      <a href="/labs" class="text-sm font-medium text-primary hover:underline">
        View all labs &rarr;
      </a>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {#each featured as lab (lab.slug)}
        <LabCard {lab} />
      {/each}
    </div>
  </Container>
</Section>

<!-- Closing CTA -->
<Section>
  <Container>
    <div class="rounded-box bg-primary p-10 text-center text-primary-content sm:p-14">
      <h2 class="text-h2">See it with your own course</h2>
      <p class="mx-auto mt-4 max-w-readable opacity-90">
        Demo seats are provisioned per request, matched to the lab you're
        teaching next.
      </p>
      <a href="/demo" class="btn btn-accent btn-lg mt-8">Request an instructor demo</a>
    </div>
  </Container>
</Section>
