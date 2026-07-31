<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- Long-form text (privacy, terms, lab detail copy). Styles the elements the
     content author writes, so pages don't repeat utility classes per paragraph. -->
<div class="prose-body">
  {@render children()}
</div>

<style>
  .prose-body {
    color: var(--color-base-content);
    line-height: 1.7;
  }

  .prose-body :global(h2) {
    font-size: var(--text-h2);
    line-height: var(--text-h2--line-height);
    letter-spacing: var(--text-h2--letter-spacing);
    font-weight: var(--text-h2--font-weight);
    margin-block: 2.5rem 1rem;
  }

  .prose-body :global(h3) {
    font-size: var(--text-h3);
    line-height: var(--text-h3--line-height);
    letter-spacing: var(--text-h3--letter-spacing);
    font-weight: var(--text-h3--font-weight);
    margin-block: 2rem 0.75rem;
  }

  .prose-body :global(:is(h2, h3):first-child) {
    margin-block-start: 0;
  }

  .prose-body :global(p),
  .prose-body :global(ul),
  .prose-body :global(ol) {
    margin-block: 1rem;
  }

  .prose-body :global(:is(ul, ol)) {
    padding-inline-start: 1.5rem;
  }

  .prose-body :global(ul) {
    list-style: disc;
  }

  .prose-body :global(ol) {
    list-style: decimal;
  }

  .prose-body :global(li) {
    margin-block: 0.375rem;
  }

  .prose-body :global(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .prose-body :global(strong) {
    font-weight: 600;
  }
</style>
