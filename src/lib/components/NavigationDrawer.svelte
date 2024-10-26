<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavBar from './NavBar.svelte';

	const { children: content }: { children: Snippet } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="navigation-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<NavBar>
			<label
				for="navigation-drawer"
				class="btn btn-square btn-ghost"
				aria-label="Open navigation drawer"
			>
				<i class="fa-solid fa-bars"></i>
			</label>
		</NavBar>

		<div class="p-5">
			{@render content()}
		</div>
	</div>
	<div class="drawer-side">
		<label for="navigation-drawer" aria-label="Close navigation drawer" class="drawer-overlay"
		></label>
		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<!-- Sidebar content here -->
			<li><a href="/">Home</a></li>
			<li><a href="/demo/lucia">Login</a></li>
		</ul>
	</div>
</div>
