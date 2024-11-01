<script lang="ts">
	import SideDrawer from '$components/SideDrawer.svelte';
	import TopBar from '$components/TopBar.svelte';
	import '$utils/faLibrary';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { autoModeWatcher, initializeStores, Modal, storePopup } from '@skeletonlabs/skeleton';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	let drawerButtonClicked = () => {
		// TODO
	};
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Modal />

<div class="grid h-screen grid-rows-[auto_1fr]">
	<header class="bg-blue-500">
		<TopBar {drawerButtonClicked} />
	</header>

	<div class="grid grid-cols-[auto_1fr] overflow-hidden">
		<aside>
			<SideDrawer></SideDrawer>
		</aside>

		<div class="overflow-scroll p-5">
			{@render children()}
		</div>
	</div>
</div>
