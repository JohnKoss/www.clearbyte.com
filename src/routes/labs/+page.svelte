<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import LabCard from '$lib/LabCard.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';
</script>

<Seo
  title="Labs"
  description="AWS lab activities written for real cloud courses and broken into small steps. Get in touch to run them, or to have one shaped around what you teach."
/>

<Section>
  <Container>
    <h1 class="text-h1">Labs</h1>
    <p class="mt-4 max-w-readable text-lead text-base-content/70">
      These labs run in real cloud courses today. Each one is broken into small
      steps, runs in a real AWS account, and is graded against what the student
      actually built.
    </p>
    <p class="mt-4 max-w-readable text-base-content/70">
      Any of them can be run as-is, or reworked around what your course
      actually needs &mdash; that flexibility is the point.
      <a class="text-primary hover:underline" href="/contact">Get in touch</a>
      to talk through which would fit.
    </p>
  </Container>
</Section>

<Section tone="muted">
  <Container>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each labs as lab (lab.slug)}
        <LabCard {lab} />
      {/each}
    </div>

    <div class="mt-12 rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <h2 class="text-h3">Need one that isn't here?</h2>
      <p class="mx-auto mt-2 max-w-readable text-base-content/70">
        That's rather the point. Send over what you're teaching and the lab can
        be shaped around it.
      </p>
      <a href="/demo" class="btn btn-primary mt-6">Try it with your class</a>
    </div>
  </Container>
</Section>
