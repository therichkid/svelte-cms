<script lang="ts">
  import { enhance } from '$app/forms';
  import { getFileSize } from '$utils/fileSize';
  import { FileUpload, Progress } from '@skeletonlabs/skeleton-svelte';
  import type { SubmitFunction } from './$types';

  interface ImageSource {
    name: string;
    width: number;
    size: number;
  }

  let { data } = $props();
  let files = $state(data.files);
  let isUploading = $state(false);

  let formElement: HTMLFormElement;

  const uploadImage: SubmitFunction = () => {
    isUploading = true;

    return async ({ update, result }) => {
      await update();

      if (result.type === 'success' && result.data && 'file' in result.data) {
        files = [...files, result.data.file];
      }

      isUploading = false;
    };
  };

  const deleteImage: SubmitFunction = ({ formData, cancel }) => {
    const id = formData.get('id');

    if (!id || typeof id !== 'string') {
      return;
    }

    // TODO: Add Skeleton confirmation dialog
    const confirmed = confirm('Are you sure you want to delete this image?');

    if (!confirmed) {
      return cancel();
    }

    return () => {
      files = files.filter((file) => file.id !== parseInt(id));
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
    <FileUpload
      name="file"
      accept="image/*"
      subtext="Image files only"
      onFileChange={() => formElement.requestSubmit()}
      disabled={isUploading}
    >
      {#snippet iconFile()}
        <span><i class="fa-solid fa-file-arrow-up fa-3x"></i></span>
      {/snippet}
    </FileUpload>
  </form>

  {#if isUploading}
    <Progress />
  {/if}

  <section class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
    {#each files as file}
      <div>
        <div class="relative">
          <img
            class="h-64 w-full max-w-full rounded-lg object-cover"
            srcset={(file.sources as ImageSource[])
              .map((source) => `/uploads/${source.name} ${source.width}w`)
              .join(', ')}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
            alt={file.name}
          />
          <div class="absolute top-0 right-0 left-0 flex items-center justify-between pl-3">
            <input type="checkbox" class="pml-2 checkbox" />

            <form action="?/delete" method="post" use:enhance={deleteImage}>
              <input type="hidden" name="id" value={file.id} />
              <button class="btn-icon" aria-label="Delete image">
                <span><i class="fa-solid fa-xmark"></i></span>
              </button>
            </form>
          </div>

          <div
            class="absolute right-0 bottom-0 left-0 rounded-lg bg-gradient-to-t from-slate-950 to-transparent p-3"
          >
            <div>
              <span class="text-gray-100">{file.name}</span>
              <small class="pl-1 text-gray-300 italic">{getFileSize(file.size)}</small>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </section>
</div>
