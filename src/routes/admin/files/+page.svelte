<script lang="ts">
	import { enhance } from '$app/forms';
	import { FileDropzone, ProgressBar } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from './$types.js';

	interface ImageSource {
		name: string;
		width: number;
		size: number;
	}

	let { data, form } = $props();
	let files = $state(data.files);
	let isUploading = $state(false);

	let formElement: HTMLFormElement;

	const uploadImage: SubmitFunction = () => {
		isUploading = true;

		return async ({ update, result }) => {
			await update();

			if (result.type === 'success' && result.data?.file) {
				files = [...files, result.data.file];
			}

			isUploading = false;
		};
	};
</script>

<div class="flex flex-col gap-4">
	<form
		bind:this={formElement}
		method="post"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance={uploadImage}
	>
		<FileDropzone
			name="file"
			accept="image/*"
			onchange={() => formElement.requestSubmit()}
			disabled={isUploading}
		>
			<svelte:fragment slot="lead">
				<span><i class="fa-solid fa-file-arrow-up fa-3x"></i></span>
			</svelte:fragment>
			<svelte:fragment slot="message">
				<strong>Upload a file</strong> or drag and drop
			</svelte:fragment>
			<svelte:fragment slot="meta">Image files only</svelte:fragment>
		</FileDropzone>
	</form>

	{#if isUploading}
		<ProgressBar />
	{/if}

	<div>
		<section class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#each files as file}
				<div>
					<img
						class="h-auto max-w-full rounded-lg"
						srcset={(file.sources as ImageSource[])
							.map((source) => `/uploads/${source.name} ${source.width}w`)
							.join(', ')}
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
						alt={file.name}
					/>
				</div>
			{/each}
		</section>
	</div>
</div>
