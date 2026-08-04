<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import LabCard from '$lib/LabCard.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const lab = $derived(data.lab);
  const others = $derived(labs.filter((l) => l.slug !== lab.slug).slice(0, 3));
</script>

<Seo title={lab.title} description={lab.summary} />

<Section>
  <Container>
    <a href="/labs" class="text-sm font-medium text-primary hover:underline">
      &larr; All labs
    </a>

    <h1 class="mt-6 text-h1">{lab.title}</h1>

    <p class="mt-4 max-w-readable text-lead text-base-content/70">{lab.summary}</p>

    <div class="mt-6 flex flex-wrap gap-2">
      {#each lab.services as service (service)}
        <span
          class="rounded-selector bg-base-200 px-3 py-1 text-sm font-medium text-base-content/80"
        >
          {service}
        </span>
      {/each}
    </div>
  </Container>
</Section>

<Section tone="muted">
  <Container>
    <h2 class="text-h2">How this lab runs</h2>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Small steps</h3>
        <p class="mt-2 text-sm text-base-content/70">
          Ordered so a student can tell whether each one worked before moving
          on &mdash; and so you can see which one they stalled on.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Yours to change</h3>
        <p class="mt-2 text-sm text-base-content/70">
          Add steps, cut steps, or rewrite the one your class keeps getting
          stuck on.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Launched from your LMS</h3>
        <p class="mt-2 text-sm text-base-content/70">
          Students open the lab from your course. No separate account or signup.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">A real AWS account</h3>
        <p class="mt-2 text-sm text-base-content/70">
          Each student gets credentials and console access to a live account.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Graded automatically</h3>
        <p class="mt-2 text-sm text-base-content/70">
          Work is checked against what was actually built, and the score returns
          to your gradebook.
        </p>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-6">
        <h3 class="font-semibold">Cleaned up after</h3>
        <p class="mt-2 text-sm text-base-content/70">
          The account is torn down when the lab ends, so nothing keeps running.
        </p>
      </div>
    </div>

    <div class="mt-10">
      <a href="/demo" class="btn btn-primary">Try it with your class</a>
    </div>
  </Container>
</Section>

<Section>
  <Container>
    <h2 class="text-h2">Other labs</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      {#each others as other (other.slug)}
        <LabCard lab={other} />
      {/each}
    </div>
  </Container>
</Section>
