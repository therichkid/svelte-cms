<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col items-center">
	<div class="w-full max-w-screen-lg">
		{@render children()}
	</div>
</div>
