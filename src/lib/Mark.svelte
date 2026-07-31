<script lang="ts">
  // The Clearbyte mark (concept 1b): three solid blocks and a fourth drawn as an
  // outline - the byte you complete. Geometry matches static/icon.svg exactly.
  //
  // Inlined rather than an <img> so the solid blocks take currentColor and the
  // outline takes the accent token, keeping the mark correct on any surface and
  // in both themes.
  let { class: klass = 'h-[22px] w-[22px]' }: { class?: string } = $props();
</script>

<svg
  class={klass}
  viewBox="0 0 128 128"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
  <rect x="23" y="23" width="38" height="38" rx="9" fill="currentColor" />
  <rect x="67" y="23" width="38" height="38" rx="9" fill="currentColor" />
  <rect x="23" y="67" width="38" height="38" rx="9" fill="currentColor" />
  <rect
    x="70"
    y="70"
    width="32"
    height="32"
    rx="6"
    fill="none"
    stroke="var(--color-accent)"
    stroke-width="6"
  />
</svg>
