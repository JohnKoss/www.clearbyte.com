<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    width = 'page',
    class: klass = '',
  }: {
    children: Snippet;
    /** 'page' for general layout, 'readable' for long-form text. */
    width?: 'page' | 'readable';
    class?: string;
  } = $props();
</script>

<div
  class="mx-auto w-full px-gutter {width === 'readable'
    ? 'max-w-readable'
    : 'max-w-page'} {klass}"
>
  {@render children()}
</div>
