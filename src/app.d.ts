// Declares the ambient types for asset imports (*.css, *.svg, ?raw, ...).
// TypeScript 6 rejects the side-effect `import '../style.css'` without them.
/// <reference types="vite/client" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
