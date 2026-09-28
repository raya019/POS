<script lang="ts">
	import './layout.css';

	const { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
</script>

<Toaster richColors position="top-center" duration={3000} />
{@render children()}
