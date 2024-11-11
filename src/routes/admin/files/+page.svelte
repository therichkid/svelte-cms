<script lang="ts">
	import { enhance } from '$app/forms';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let form: HTMLFormElement;
</script>

<form bind:this={form} method="post" action="?/upload" enctype="multipart/form-data" use:enhance>
	<FileDropzone name="file" accept="image/*" onchange={() => form.requestSubmit()}>
		<svelte:fragment slot="lead">
			<span><i class="fa-solid fa-file-arrow-up fa-3x"></i></span>
		</svelte:fragment>
		<svelte:fragment slot="message">
			<strong>Upload a file</strong> or drag and drop
		</svelte:fragment>
		<svelte:fragment slot="meta">Image files only</svelte:fragment>
	</FileDropzone>
</form>
