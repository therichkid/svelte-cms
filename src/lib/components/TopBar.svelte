<script lang="ts">
	import type { SessionValidationResult } from '$lib/server/auth/session';
	import { AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	let {
		drawerButtonClicked = $bindable(),
		user,
	}: { drawerButtonClicked: () => void; user: SessionValidationResult['user'] | null } = $props();

	const optionsMenuPopup: PopupSettings = {
		event: 'click',
		target: 'optionsMenu',
		placement: 'bottom-end',
	};
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<button
			onclick={drawerButtonClicked}
			class="bg-initial btn-icon"
			aria-label="Toggle navigation drawer"
		>
			<span><i class="fa-solid fa-bars"></i> </span></button
		>

		<a href="/" class="bg-initial btn py-0">
			<h2 class="h3 font-bold">Svelte CMS</h2>
		</a>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<button type="button" use:popup={optionsMenuPopup} class="bg-initial btn-icon">
			{#if user}
				<img src="https://i.pravatar.cc/50?u={user.id}" class="rounded-full" alt="User avatar" />
			{:else}
				<span><i class="fas fa-ellipsis-h"></i></span>
			{/if}
		</button>

		<div class="card w-72 p-4 shadow-xl" data-popup="optionsMenu">
			{#if user}
				<div class="p-2">
					<h3 class="h4 font-bold">Welcome, {user.name}!</h3>
				</div>
				<hr class="my-2" />
				<ul class="list-nav">
					<li>
						<a href="/profile" class="w-full text-left">Profile</a>
					</li>
					<li>
						<a href="/logout" class="w-full text-left">Logout</a>
					</li>
				</ul>
			{:else}
				<div class="p-2">
					<h3 class="h4 font-bold">Welcome!</h3>
				</div>
				<hr class="my-2" />
				<ul class="list-nav">
					<li>
						<a href="/login" class="w-full text-left">Login</a>
					</li>
					<li>
						<a href="/register" class="w-full text-left">Register</a>
					</li>
				</ul>
			{/if}
		</div>
	</svelte:fragment>
</AppBar>
