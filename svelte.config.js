import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		prerender: {
			handleMissingId: 'fail',
		},
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: null,
			precompress: false, // CloudFront will handle this.
			strict: true
		}),
		paths: {
			base: "/lti13/instructor",
			relative: false
		},
		alias: {
			$lib: "src/lib",
			$components: "src/lib/components",			
		},
	},
	
	// Enable runes mode in Svelte 5
	// compilerOptions: {
	// 	runes: true
	// },

	base: "/myapp/",  // ✅ Adjust base URL for production
};

export default config;
