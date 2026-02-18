import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	process.env = { ...process.env, ...env };

	return {
		plugins: [tailwindcss(), sveltekit()],
		define: {
			// Only expose VITE_ prefixed vars to the client bundle
			// Do NOT put secrets here
		}
	};
});
