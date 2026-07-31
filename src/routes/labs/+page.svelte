<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import LabCard from '$lib/LabCard.svelte';
  import Seo from '$lib/Seo.svelte';
  import { labs } from '$lib/labs';
</script>

<Seo
  title="Lab catalog"
  description="Byte-size AWS lab activities for schools, launched from your LMS and run in a real AWS account."
/>

<Section>
  <Container>
    <h1 class="text-h1">Lab catalog</h1>
    <p class="mt-4 max-w-readable text-lead text-base-content/70">
      Each lab is broken into byte-size steps &mdash; more of them, each small
      enough to finish and check. They run in a real AWS account, launch from
      your course, and are graded automatically. The account is destroyed when
      the lab ends.
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
      <h2 class="text-h3">Want to try one with your class?</h2>
      <p class="mx-auto mt-2 max-w-readable text-base-content/70">
        Demo seats are provisioned per request, so we can match the lab to what
        you are teaching.
      </p>
      <a href="/demo" class="btn btn-primary mt-6">Request a demo</a>
    </div>
  </Container>
</Section>
