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
	<h1 class="h3 font-bold">Login/Register</h1>

	<form method="post" action="?/login" use:enhance class="flex flex-col gap-4">
		<label class="label">
			<span>Username</span>
			<input type="text" name="username" required class="input" />
		</label>

		<label class="label">
			<span>Password</span>

			<input type="password" name="password" required class="input" />
		</label>

		<div class="mt-2">
			<button class="variant-filled-primary btn mr-1">Login</button>
			<button formaction="?/register" class="variant-soft btn">Register</button>
		</div>
	</form>

	{#if formErrorMessage}
		<div class="toast">
			<div class="alert-error alert">
				<span>{formErrorMessage}</span>
			</div>
		</div>
	{/if}
</div>
