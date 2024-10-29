<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="mb-5 flex items-center justify-between">
	<h1 class="h3 font-bold">Hi, {data.user.name}!</h1>
	<form method="post" action="?/logout" use:enhance>
		<button class="variant-soft btn">
			<span>
				<i class="fa-solid fa-right-from-bracket"></i>
			</span>
			<span>Sign out</span>
		</button>
	</form>
</div>
