<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';
	import type { LoginSchemaKey } from './schema';

	let { form } = $props();

	let fieldErrors = $state(form?.fieldErrors);
	let formErrors = $state(form?.formErrors);

	const resetFieldError = (control: LoginSchemaKey) => {
		fieldErrors?.[control] && (fieldErrors[control] = undefined);
		formErrors = undefined;
	};
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<h1 class="h3 font-bold">Login</h1>

	<form
		method="post"
		use:enhance={() => {
			return async ({ formElement, update, result }) => {
				formElement.reset();
				await update();

				if ('data' in result) {
					const data = result.data as ActionData;
					formErrors = data?.formErrors;
					fieldErrors = data?.fieldErrors;
				}
			};
		}}
		class="flex flex-col gap-4"
	>
		<label class="label">
			<span>Username or Email</span>
			<input
				type="text"
				name="username"
				required
				value={form?.data?.username || ''}
				oninput={() => resetFieldError('username')}
				class="input {fieldErrors?.username && 'input-error'}"
			/>
			{#if fieldErrors?.username}
				<p class="mt-2 text-error-500">{fieldErrors.username[0]}</p>
			{/if}
		</label>

		<label class="label">
			<span>Password</span>
			<input
				type="password"
				name="password"
				required
				value={form?.data?.password || ''}
				oninput={() => resetFieldError('password')}
				class="input {fieldErrors?.password && 'input-error'}"
			/>
			{#if fieldErrors?.password}
				<p class="mt-2 text-error-500">{fieldErrors.password[0]}</p>
			{/if}
		</label>

		<div class="mt-3 flex justify-center">
			<button class="variant-filled-primary btn">Login</button>
		</div>
	</form>

	{#if formErrors}
		<p class="mt-2 text-error-500">{formErrors[0]}</p>
	{/if}

	<p class="mt-2">
		<a href="/register" class="anchor">Don't have an account yet?</a>
	</p>
</div>
