<script lang="ts">
  import { page } from '$app/state';

  let {
    title,
    description,
    noindex = false,
    image = '/og.png',
  }: {
    /** Page title, without the site suffix. */
    title: string;
    description: string;
    noindex?: boolean;
    image?: string;
  } = $props();

  const SITE = 'https://www.clearbyte.com';
  const NAME = 'Clearbyte';

  // Derived from the route rather than passed in, so a canonical can't drift
  // from the page it sits on.
  // Root keeps its slash so the canonical matches the sitemap entry exactly.
  const canonical = $derived(
    SITE + (page.url.pathname === '/' ? '/' : page.url.pathname.replace(/\/$/, ''))
  );

  const fullTitle = $derived(title === NAME ? title : `${title} | ${NAME}`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  {#if noindex}
    <meta name="robots" content="noindex" />
  {/if}

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={NAME} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={SITE + image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={SITE + image} />
</svelte:head>
