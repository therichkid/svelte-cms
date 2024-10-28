<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';

	export let drawerButtonClicked: () => void;
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<button
			onclick={drawerButtonClicked}
			class="bg-initial btn btn-icon"
			aria-label="Toggle navigation drawer"
		>
			<i class="fa-solid fa-bars"></i>
		</button>

		<a href="/" class="bg-initial btn py-0">
			<h2 class="h3 font-bold">Svelte CMS</h2>
		</a>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<button class="bg-initial btn btn-icon" aria-label="Open settings">
			<i class="fas fa-ellipsis-h"></i>
		</button>
	</svelte:fragment>
</AppBar>
