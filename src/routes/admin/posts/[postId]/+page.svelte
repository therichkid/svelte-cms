<script lang="ts">
  import { enhance } from '$app/forms';
  import Editor from '$components/TipTap/Editor.svelte';
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
  import { onMount } from 'svelte';
  import type { ActionData, SubmitFunction } from './$types';
  import { PostMode } from './mode';
  import type { PostSchemaKey } from './schema';

  let { data, form } = $props();

  let title = $state(form?.data.title);
  let excerpt = $state(form?.data.excerpt);
  let content = $state(form?.data.content);
  let fieldErrors = $state(form?.fieldErrors);
  let formErrors = $state(form?.formErrors);

  $effect(() => {
    content && resetFieldError('content');
  });

  const createOrUpdatePost: SubmitFunction = () => {
    return async ({ update, result }) => {
      await update();

      if (result.type === 'failure') {
        const data = result.data as ActionData;

        title = data?.data?.title || '';
        excerpt = data?.data?.excerpt || '';
        content = data?.data?.content || '';
        formErrors = data?.formErrors;
        fieldErrors = data?.fieldErrors;
      }
    };
  };

  const resetFieldError = (control: PostSchemaKey) => {
    fieldErrors?.[control] && (fieldErrors[control] = undefined);
    formErrors = undefined;
  };

  onMount(() => {
    if (data.post) {
      title = data.post.title;
      excerpt = data.post.excerpt || '';
      content = data.post.content;
    }
  });
</script>

<div class="mb-3 flex w-full justify-between">
  <h1 class="h3 font-bold">{data.mode === PostMode.CREATE ? 'Add New' : 'Edit'} Post</h1>
</div>

<form method="post" use:enhance={createOrUpdatePost} class="flex flex-col gap-4">
  <label class="label">
    <span>Title</span>
    <input
      type="text"
      name="title"
      bind:value={title}
      oninput={() => resetFieldError('title')}
      class="input {fieldErrors?.title && 'input-error'}"
    />
    {#if fieldErrors?.title}
      <p class="text-error-500 mt-2 text-sm">{fieldErrors.title[0]}</p>
    {/if}
  </label>

  <Accordion>
    <Accordion.Item value="excerpt">
      {#snippet lead()}
        <span><i class="fa fa-list"></i></span>
      {/snippet}
      {#snippet control()}Excerpt{/snippet}
      {#snippet panel()}
        <textarea
          name="excerpt"
          bind:value={excerpt}
          rows="4"
          oninput={() => resetFieldError('excerpt')}
          class="textarea {fieldErrors?.excerpt && 'input-error'}"
        ></textarea>
        {#if fieldErrors?.excerpt}
          <p class="text-error-500 mt-2 text-sm">{fieldErrors.excerpt[0]}</p>
        {/if}
      {/snippet}
    </Accordion.Item>
  </Accordion>

  <Editor bind:value={content} label="Content" />
  <input type="hidden" name="content" value={content} />
  {#if fieldErrors?.content}
    <p class="text-error-500 mt-2 text-sm">{fieldErrors.content[0]}</p>
  {/if}

  <div class="mt-2 flex justify-end gap-2">
    <button type="button" onclick={() => window.history.back()} class="preset-tonal btn">
      Cancel
    </button>
    <button class="preset-filled-primary-500 btn">
      {data.mode === PostMode.CREATE ? 'Create' : 'Update'}
    </button>
  </div>
</form>
