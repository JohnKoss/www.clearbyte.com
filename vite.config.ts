import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from 'dotenv';

// Load environment variables from .env.development if in development mode
if (process.env.NODE_ENV === 'development') {
	dotenv.config({ path: '.env.development' });
}

export default defineConfig({
	// define: {
	// 	'process.env.PUBLIC_TEST_JWT': JSON.stringify(process.env.PUBLIC_TEST_JWT),
	// },
	plugins: [tailwindcss(), sveltekit()],
	build: {
		minify: true, // Minify the output. Turn off for debugging
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('prosemirror')) return 'pm';
					if (id.includes('codemirror')) return 'cm';
					if (id.includes('tiptap')) return 'tt';
					if (id.includes('src/lib')) return 'lib';
					if (id.includes('src/pages')) return 'pages';
				},
				inlineDynamicImports: false, // Ensure dynamic imports are not inlined
			}
		}
	},
});

// rollupOptions: {
// 	output: {
// 		manualChunks(id) {
// 			if (id.includes('prosemirror')) {
// 				return 'pm';
// 			}
// 			if (id.includes('codemirror')) {
// 				return 'cm';
// 			}
// 			if (id.includes('tiptap')) {
// 				return 'tt';
// 			}
// 			if (id.includes('src/lib')) {
// 				return 'lib';
// 			}
// 			if (id.includes('src/pages')) {
// 				return 'pages';
// 			}
// 		}
// 	}
// }
/////////////////////////////////////
//import { visualizer } from 'rollup-plugin-visualizer';
// visualizer({
// 	filename: 'stats.html', // Output file
// 	gzipSize: true, // Show gzip sizes
// 	brotliSize: true, // Show brotli sizes
// })

// 'process.env.PUBLIC_TEST_LAB_ID': JSON.stringify(process.env.PUBLIC_TEST_LAB_ID),
// 'process.env.PUBLIC_TEST_LAB_NAME': JSON.stringify(process.env.PUBLIC_TEST_LAB_NAME),
// 'process.env.PUBLIC_TEST_SUB': JSON.stringify(process.env.PUBLIC_TEST_SUB),
