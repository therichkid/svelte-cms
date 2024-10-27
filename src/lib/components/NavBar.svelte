<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children: drawerButton }: { children: Snippet } = $props();
</script>

<div class="navbar bg-base-200">
	<div class="flex-none lg:hidden">
		{@render drawerButton()}
	</div>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Svelte CMS</a>
	</div>
	<div class="flex-none">
		<button class="btn btn-square btn-ghost" aria-label="Settings">
			<i class="fas fa-ellipsis-h"></i>
		</button>
	</div>
</div>
