<script lang="ts">
	import { enhance } from '$app/forms';
	import TipTapEditor from '$components/TipTapEditor.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold">Hi, {data.user.name}!</h1>
	<form method="post" action="?/logout" use:enhance>
		<button class="btn btn-neutral">Sign out</button>
	</form>
</div>

<TipTapEditor value="<p>Hello World! 🌍️</p>" />
