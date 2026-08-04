<script lang="ts">
  import { page } from '$app/state';

  let {
    title,
    description,
    noindex = false,
    image = '/og.png',
    faq,
  }: {
    /** Page title, without the site suffix. */
    title: string;
    description: string;
    noindex?: boolean;
    image?: string;
    /** Emits FAQPage structured data. Only pass on pages that visibly show these Q&As. */
    faq?: { question: string; answer: string }[];
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

  // Structured data. Answer engines lean on this to work out what a thing is,
  // so it states the category plainly rather than in marketing terms.
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: NAME,
    url: SITE,
    applicationCategory: 'EducationalApplication',
    description:
      'A tool for creating custom cloud computing lab activities. Instructors author labs as small ordered steps; students complete them in a real AWS account launched from the LMS; work is graded automatically against what was built.',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'instructor',
    },
    featureList: [
      'Author custom cloud computing lab activities',
      'Revise a lab between sections when students get stuck',
      'Per-student AWS accounts, provisioned and destroyed automatically',
      'LTI 1.3 launch from the course LMS',
      'Automatic grading against what was built in the account',
      'Runs exclusively on AWS, built on on-demand services so cost tracks use',
    ],
  };

  const faqSchema = $derived(
    faq && faq.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }
      : null
  );

  // Escaping "<" keeps a stray closing tag in the data from breaking out of the
  // script element.
  const ld = (data: unknown) =>
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}<\/script>`;
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

  {@html ld(appSchema)}
  {#if faqSchema}
    {@html ld(faqSchema)}
  {/if}
</svelte:head>
