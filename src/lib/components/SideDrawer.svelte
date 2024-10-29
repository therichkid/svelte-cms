<script lang="ts">
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
</script>

<AppRail>
	<!-- Top -->
	<svelte:fragment slot="lead">
		<AppRailAnchor href="/" title="Home" selected={$page.url.pathname === '/'}>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-home"></i>
			</svelte:fragment>
			<span>Home</span>
		</AppRailAnchor>
		<AppRailAnchor
			href="/admin/posts"
			title="Admin"
			selected={$page.url.pathname.includes('/admin')}
		>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-hammer"></i>
			</svelte:fragment>
			<span>Admin</span>
		</AppRailAnchor>
	</svelte:fragment>

	<!-- Bottom -->
	<svelte:fragment slot="trail">
		<AppRailAnchor
			href="/settings"
			title="Settings"
			selected={$page.url.pathname.includes('/settings')}
		>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-gear"></i>
			</svelte:fragment>
			<span>Settings</span>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
