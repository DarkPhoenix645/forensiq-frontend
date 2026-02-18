<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	function handleAnchorClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const anchor = target.closest('a');
		if (!anchor) return;

		const href = anchor.getAttribute('href');
		if (!href?.startsWith('#')) return;

		e.preventDefault();
		const el = document.querySelector(href);
		if (!el) return;

		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:window on:click={handleAnchorClick} />
<Toaster
	richColors
	position="bottom-right"
	toastOptions={{
		classes: {
			success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
			loading: 'bg-background border-border text-foreground'
		}
	}}
/>

{@render children()}
