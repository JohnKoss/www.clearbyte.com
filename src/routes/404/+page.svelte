<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Seo from '$lib/Seo.svelte';
</script>

<Seo
  title="Page not found"
  description="The page you're looking for may have moved or no longer exists."
  noindex
/>

<Section>
  <Container width="readable">
    <div class="text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-accent">
        Error 404
      </p>
      <h1 class="mt-3 text-h1">We couldn't find that page</h1>
      <p class="mt-4 text-lead text-base-content/70">
        The page you're looking for may have moved or no longer exists.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a href="/" class="btn btn-primary">Go home</a>
        <a href="/labs" class="btn btn-outline">Browse labs</a>
        <a href="/contact" class="btn btn-outline">Contact us</a>
      </div>
    </div>
  </Container>
</Section>
