<script lang="ts">
	import { enhance } from '$app/forms';
	import { type RegisterSchemaKey } from './schema';

	let { form } = $props();

	const resetFieldError = (control: RegisterSchemaKey) => {
		if (!form?.fieldErrors?.[control]) return;

		form.fieldErrors[control] = undefined;
		form.formErrors = undefined;
	};
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<h1 class="h3 font-bold">Register</h1>

	<form method="post" use:enhance class="flex flex-col gap-4">
		<label class="label">
			<span>Username</span>
			<input
				type="text"
				name="username"
				required
				value={form?.data?.username || ''}
				oninput={() => resetFieldError('username')}
				class="input {form?.fieldErrors?.username && 'input-error'}"
			/>
			{#if form?.fieldErrors?.username}
				<p class="mt-2 text-error-500">{form.fieldErrors.username[0]}</p>
			{/if}
		</label>

		<label class="label">
			<span>Email</span>
			<input
				type="text"
				name="email"
				required
				value={form?.data?.email || ''}
				oninput={() => resetFieldError('email')}
				class="input {form?.fieldErrors?.email && 'input-error'}"
			/>
			{#if form?.fieldErrors?.email}
				<p class="mt-2 text-error-500">{form.fieldErrors.email[0]}</p>
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
				class="input {form?.fieldErrors?.password && 'input-error'}"
			/>
			{#if form?.fieldErrors?.password}
				<p class="mt-2 text-error-500">{form.fieldErrors.password[0]}</p>
			{/if}
		</label>

		<label class="label">
			<span>Confirm Password</span>
			<input
				type="password"
				name="password"
				required
				value={form?.data?.confirmPassword || ''}
				oninput={() => resetFieldError('confirmPassword')}
				class="input {form?.fieldErrors?.confirmPassword && 'input-error'}"
			/>
			{#if form?.fieldErrors?.confirmPassword}
				<p class="mt-2 text-error-500">{form.fieldErrors.confirmPassword[0]}</p>
			{/if}
		</label>

		<div class="mt-3 flex justify-center">
			<button class="variant-filled-primary btn">Register</button>
		</div>
	</form>

	{#if form?.formErrors}
		<p class="mt-2 text-error-500">{form.formErrors[0]}</p>
	{/if}

	<p class="mt-2">
		<a href="/login" class="anchor">Already have an account?</a>
	</p>
</div>
