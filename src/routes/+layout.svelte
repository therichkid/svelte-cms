<script lang="ts">
	import NavigationDrawer from '$lib/components/NavigationDrawer.svelte';
	import '$lib/utils/faLibrary';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<NavigationDrawer>
	{@render children()}
</NavigationDrawer>
