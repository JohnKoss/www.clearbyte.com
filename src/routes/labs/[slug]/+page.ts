import { error } from '@sveltejs/kit';
import { labs, labBySlug } from '$lib/labs';
import type { EntryGenerator, PageLoad } from './$types';

// Tells the static adapter which slugs to prerender.
export const entries: EntryGenerator = () => labs.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  const lab = labBySlug(params.slug);

  if (!lab) {
    error(404, `No lab named ${params.slug}`);
  }

  return { lab };
};
