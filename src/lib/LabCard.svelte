<script lang="ts">
  import type { Lab } from '$lib/labs';

  let { lab }: { lab: Lab } = $props();
</script>

<a
  href="/labs/{lab.slug}"
  class="group flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6 shadow-card transition-shadow hover:shadow-raised"
>
  <h3 class="text-h3 group-hover:text-primary">{lab.title}</h3>

  <p class="mt-2 flex-1 text-base-content/70">{lab.summary}</p>

  <div class="mt-4 flex flex-wrap gap-2">
    {#each lab.services as service (service)}
      <span
        class="rounded-selector bg-base-200 px-2 py-1 text-xs font-medium text-base-content/80"
      >
        {service}
      </span>
    {/each}
  </div>
</a>
