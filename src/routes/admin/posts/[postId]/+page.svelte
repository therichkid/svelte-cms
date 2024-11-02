<script lang="ts">
	import { enhance } from '$app/forms';
	import Editor from '$components/TipTap/Editor.svelte';
	import { onMount } from 'svelte';
	import { PostMode } from './mode.js';

	let { data, form } = $props();

	let title = $state<string>('');
	let content = $state<string>('');
	let formErrorMessage = $state<string | undefined>();

	$effect(() => {
		if (form?.message) {
			formErrorMessage = form.message;

			setTimeout(() => {
				formErrorMessage = undefined;
			}, 3000);
		}
	});

	onMount(() => {
		if (data.post) {
			title = data.post.title;
			content = data.post.content;
		}
	});
</script>

<div class="mb-3 flex w-full justify-between">
	<h1 class="h3 font-bold">{data.mode === PostMode.CREATE ? 'Add New' : 'Edit'} Post</h1>
</div>

<form method="post" action="?/submit" use:enhance class="flex flex-col gap-4">
	<label class="label">
		<span>Title</span>
		<input type="text" name="title" required bind:value={title} class="input" />
	</label>

	<Editor bind:value={content} label="Content" />
	<input type="hidden" name="content" bind:value={content} />

	<div class="mt-2">
		<button class="variant-filled-primary btn mr-1">
			{data.mode === PostMode.CREATE ? 'Create' : 'Update'}</button
		>
		<button type="button" onclick={() => window.history.back()} class="variant-soft btn">
			Cancel
		</button>
	</div>

	{#if formErrorMessage}
		<div class="toast">
			<div class="alert-error alert">
				<span>{formErrorMessage}</span>
			</div>
		</div>
	{/if}
</form>
