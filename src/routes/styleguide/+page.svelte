<script lang="ts">
  import Section from '$lib/Section.svelte';
  import Container from '$lib/Container.svelte';
  import Prose from '$lib/Prose.svelte';
  import Seo from '$lib/Seo.svelte';

  // Class names are written out in full: Tailwind scans source text, so
  // interpolated names like `bg-{name}` would never be generated.
  const colors = [
    { name: 'primary', cls: 'bg-primary text-primary-content' },
    { name: 'secondary', cls: 'bg-secondary text-secondary-content' },
    { name: 'accent', cls: 'bg-accent text-accent-content' },
    { name: 'neutral', cls: 'bg-neutral text-neutral-content' },
    { name: 'info', cls: 'bg-info text-info-content' },
    { name: 'success', cls: 'bg-success text-success-content' },
    { name: 'warning', cls: 'bg-warning text-warning-content' },
    { name: 'error', cls: 'bg-error text-error-content' },
  ];

  const surfaces = [
    { name: 'base-100', cls: 'bg-base-100' },
    { name: 'base-200', cls: 'bg-base-200' },
    { name: 'base-300', cls: 'bg-base-300' },
  ];

  const type = [
    { cls: 'text-display', label: 'display' },
    { cls: 'text-h1', label: 'h1' },
    { cls: 'text-h2', label: 'h2' },
    { cls: 'text-h3', label: 'h3' },
    { cls: 'text-lead', label: 'lead' },
    { cls: 'text-base', label: 'body' },
    { cls: 'text-sm', label: 'small' },
  ];
</script>

<Seo
  title="Styleguide"
  description="Internal reference rendering every Clearbyte design token."
  noindex
/>

<Section>
  <Container>
    <h1 class="text-h1">Styleguide</h1>
    <p class="text-lead text-base-content/70 mt-4">
      Every design token, rendered. This page follows your OS light/dark
      setting &mdash; switch it to check both themes.
    </p>
  </Container>
</Section>

<Section tone="muted">
  <Container>
    <h2 class="text-h2 mb-8">Type scale</h2>
    <div class="space-y-6">
      {#each type as t (t.cls)}
        <div>
          <div class="text-sm text-base-content/60 mb-1">{t.label} &mdash; .{t.cls}</div>
          <div class={t.cls}>Real, hands-on AWS labs</div>
        </div>
      {/each}
    </div>
  </Container>
</Section>

<Section>
  <Container>
    <h2 class="text-h2 mb-8">Colour tokens</h2>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each colors as c (c.name)}
        <div class="rounded-box overflow-hidden shadow-card">
          <div class="{c.cls} p-6">
            <div class="font-semibold">{c.name}</div>
            <div class="text-sm opacity-80">on {c.name}-content</div>
          </div>
        </div>
      {/each}
    </div>

    <h3 class="text-h3 mt-12 mb-4">Surfaces</h3>
    <div class="grid gap-4 sm:grid-cols-3">
      {#each surfaces as s (s.name)}
        <div
          class="{s.cls} text-base-content border border-base-300 rounded-box p-6"
        >
          <div class="font-semibold">{s.name}</div>
          <div class="text-sm text-base-content/70">base-content on {s.name}</div>
        </div>
      {/each}
    </div>
  </Container>
</Section>

<Section tone="muted">
  <Container>
    <h2 class="text-h2 mb-8">Radius &amp; elevation</h2>
    <div class="grid gap-6 sm:grid-cols-3">
      <div class="bg-base-100 rounded-selector p-6 shadow-card">
        <div class="font-semibold">rounded-selector</div>
        <div class="text-sm text-base-content/70">shadow-card</div>
      </div>
      <div class="bg-base-100 rounded-field p-6 shadow-card">
        <div class="font-semibold">rounded-field</div>
        <div class="text-sm text-base-content/70">shadow-card</div>
      </div>
      <div class="bg-base-100 rounded-box p-6 shadow-raised">
        <div class="font-semibold">rounded-box</div>
        <div class="text-sm text-base-content/70">shadow-raised</div>
      </div>
    </div>
  </Container>
</Section>

<Section>
  <Container>
    <h2 class="text-h2 mb-8">Components</h2>

    <div class="flex flex-wrap gap-3">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-accent">Accent</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-ghost">Ghost</button>
    </div>

    <div class="grid gap-4 mt-8 sm:grid-cols-2">
      <div class="alert alert-success"><span>Success alert</span></div>
      <div class="alert alert-error"><span>Error alert</span></div>
      <div class="alert alert-info"><span>Info alert</span></div>
      <div class="alert alert-warning"><span>Warning alert</span></div>
    </div>

    <div class="mt-8 max-w-sm space-y-3">
      <input class="input input-bordered w-full" placeholder="Input field" />
      <textarea class="textarea textarea-bordered w-full" placeholder="Textarea"
      ></textarea>
    </div>
  </Container>
</Section>

<Section tone="muted">
  <Container width="readable">
    <h2 class="text-h2 mb-8">Prose</h2>
    <Prose>
      <h2>A heading inside prose</h2>
      <p>
        Body copy set at a readable measure. This is the container used for the
        privacy policy, the terms, and long-form lab descriptions.
      </p>
      <h3>A subheading</h3>
      <p>
        Paragraphs, <strong>bold text</strong> and
        <a href="/styleguide">links</a> all inherit from the token layer rather than
        per-page utility classes.
      </p>
      <ul>
        <li>An unordered list item</li>
        <li>Another item</li>
      </ul>
    </Prose>
  </Container>
</Section>
