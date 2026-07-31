<script lang="ts">
  import '../style.css';
  import Logo from '$lib/Logo.svelte';
  import Container from '$lib/Container.svelte';

  let { children } = $props();

  let open = $state(false);

  // SMS Opt-in stays in the primary nav: carriers require the opt-in page to be
  // publicly reachable and visible to a reviewer, not buried in the footer.
  const nav = [
    { href: '/labs', label: 'Labs' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/opt-in', label: 'SMS Opt-in' },
  ];
</script>

<a
  href="#main"
  class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-field focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content"
>
  Skip to content
</a>

<header
  class="sticky top-0 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur"
>
  <Container>
    <div class="flex h-16 items-center justify-between gap-4">
      <div class="text-primary shrink-0">
        <Logo />
      </div>

      <!-- Desktop -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        {#each nav as item (item.href)}
          <a
            href={item.href}
            class="rounded-field px-3 py-2 text-sm font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
          >
            {item.label}
          </a>
        {/each}
        <a href="/demo" class="btn btn-primary btn-sm ml-2">Request a demo</a>
      </nav>

      <!-- Mobile -->
      <button
        type="button"
        class="btn btn-ghost btn-sm md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onclick={() => (open = !open)}
      >
        <span class="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {#if open}
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        {:else}
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          </svg>
        {/if}
      </button>
    </div>
  </Container>

  {#if open}
    <nav id="mobile-nav" class="border-t border-base-300 md:hidden" aria-label="Main">
      <Container>
        <div class="flex flex-col gap-1 py-3">
          {#each nav as item (item.href)}
            <a
              href={item.href}
              class="rounded-field px-3 py-2 font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content"
              onclick={() => (open = false)}
            >
              {item.label}
            </a>
          {/each}
          <a
            href="/demo"
            class="btn btn-primary mt-2"
            onclick={() => (open = false)}
          >
            Request a demo
          </a>
        </div>
      </Container>
    </nav>
  {/if}
</header>

<main id="main">
  {@render children()}
</main>

<footer class="border-t border-base-300 bg-base-200">
  <Container>
    <div class="grid gap-10 py-section sm:grid-cols-2 lg:grid-cols-4">
      <div class="lg:col-span-1">
        <div class="text-primary">
          <Logo />
        </div>
        <p class="mt-3 text-sm text-base-content/70">
          Byte-size AWS lab activities, built for schools.
        </p>
      </div>

      <div>
        <h2 class="text-sm font-semibold">Labs</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a class="text-base-content/70 hover:text-base-content" href="/labs">Lab catalog</a></li>
          <li><a class="text-base-content/70 hover:text-base-content" href="/demo">Request a demo</a></li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-semibold">Company</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a class="text-base-content/70 hover:text-base-content" href="/about">About</a></li>
          <li><a class="text-base-content/70 hover:text-base-content" href="/contact">Contact</a></li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-semibold">Legal</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a class="text-base-content/70 hover:text-base-content" href="/privacy">Privacy policy</a></li>
          <li><a class="text-base-content/70 hover:text-base-content" href="/terms">Terms &amp; conditions</a></li>
          <li><a class="text-base-content/70 hover:text-base-content" href="/opt-in">SMS opt-in</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-base-300 py-6 text-sm text-base-content/60">
      &copy; {new Date().getFullYear()} Clearbyte Inc. All rights reserved.
    </div>
  </Container>
</footer>
