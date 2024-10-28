<script lang="ts">
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
</script>

<AppRail>
	<!-- Top -->
	<svelte:fragment slot="lead">
		<AppRailAnchor href="/" title="Home">
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-home"></i>
			</svelte:fragment>
			<span>Home</span>
		</AppRailAnchor>
		<AppRailAnchor href="/admin" title="Admin">
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-hammer"></i>
			</svelte:fragment>
			<span>Admin</span>
		</AppRailAnchor>
	</svelte:fragment>

	<!-- Bottom -->
	<svelte:fragment slot="trail">
		<AppRailAnchor href="/" title="Home">
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-gear"></i>
			</svelte:fragment>
			<span>Settings</span>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
