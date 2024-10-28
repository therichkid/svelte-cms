<script lang="ts">
	import { enhance } from '$app/forms';
	import Editor from '$components/TipTap/Editor.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="mb-5 flex items-center justify-between">
	<h1 class="h3 font-bold">Hi, {data.user.name}!</h1>
	<form method="post" action="?/logout" use:enhance>
		<button class="variant-soft btn">
			<span>Sign out</span>
			<span>
				<i class="fa-solid fa-right-from-bracket"></i>
			</span>
		</button>
	</form>
</div>

<Editor value="<p>Hello World! 🌍️</p>" />
