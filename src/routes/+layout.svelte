<script lang="ts">
	import NavigationDrawer from '$components/NavigationDrawer.svelte';
	import '$utils/faLibrary';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<NavigationDrawer>
	{@render children()}
</NavigationDrawer>
