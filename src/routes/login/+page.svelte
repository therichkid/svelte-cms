<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let formErrorMessage = $state<string | undefined>();

	$effect(() => {
		if (form?.message) {
			formErrorMessage = form.message;

			setTimeout(() => {
				formErrorMessage = undefined;
			}, 3000);
		}
	});
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<h1 class="text-2xl font-bold">Login/Register</h1>

	<form method="post" action="?/login" use:enhance>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Username</span>
			</div>

			<input type="text" name="username" required class="input input-bordered w-full max-w-xs" />
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text">Password</span>
			</div>

			<input
				type="password"
				name="password"
				required
				class="input input-bordered w-full max-w-xs"
			/>
		</label>

		<div class="mt-4">
			<button class="btn btn-primary mr-1">Login</button>
			<button formaction="?/register" class="btn btn-neutral">Register</button>
		</div>
	</form>

	{#if formErrorMessage}
		<div class="toast">
			<div class="alert alert-error">
				<span>{formErrorMessage}</span>
			</div>
		</div>
	{/if}
</div>
