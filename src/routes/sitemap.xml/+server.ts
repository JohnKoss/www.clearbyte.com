import { labs } from '$lib/labs';

export const prerender = true;

const SITE = 'https://www.clearbyte.com';

// Indexable routes only - /404 and /styleguide are noindex and stay out.
const staticPaths = [
  '/',
  '/labs',
  '/about',
  '/demo',
  '/contact',
  '/opt-in',
  '/privacy',
  '/terms',
];

export function GET() {
  // Lab pages come from the manifest, so the sitemap cannot drift from the catalog.
  const paths = [...staticPaths, ...labs.map(({ slug }) => `/labs/${slug}`)];

  const urls = paths
    .map((path) => `  <url><loc>${SITE}${path === '/' ? '/' : path}</loc></url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
