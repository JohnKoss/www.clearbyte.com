<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    tone = 'base',
    id = undefined,
    class: klass = '',
  }: {
    children: Snippet;
    /** 'muted' gives the section a recessed surface to separate it from its neighbours. */
    tone?: 'base' | 'muted';
    id?: string;
    class?: string;
  } = $props();
</script>

<section
  {id}
  class="py-section {tone === 'muted' ? 'bg-base-200' : 'bg-base-100'} {klass}"
>
  {@render children()}
</section>
