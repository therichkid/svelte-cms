<script lang="ts">
	import { enhance } from '$app/forms';
	import Editor from '$components/TipTap/Editor.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="mb-5 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Hi, {data.user.name}!</h1>
	<form method="post" action="?/logout" use:enhance>
		<button class="btn btn-neutral">Sign out</button>
	</form>
</div>

<Editor value="<p>Hello World! 🌍️</p>" />
