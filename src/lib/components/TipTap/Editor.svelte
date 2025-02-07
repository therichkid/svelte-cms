<script lang="ts">
  import { Editor } from '@tiptap/core';
  import BubbleMenu from '@tiptap/extension-bubble-menu';
  import CharacterCount from '@tiptap/extension-character-count';
  import Underline from '@tiptap/extension-underline';
  import StarterKit from '@tiptap/starter-kit';
  import { onDestroy, onMount } from 'svelte';
  import CustomBubbleMenu from './BubbleMenu.svelte';
  import Chatbot from './Chatbot.svelte';

  let {
    label,
    value = $bindable(),
  }: { label?: string; value: string | FormDataEntryValue | undefined } = $props();

  let tiptapEditor = $state<Editor | undefined>(undefined);

  let element: HTMLElement;
  let bMenu: HTMLElement;

  $effect(() => {
    if (typeof value === 'string' && value !== tiptapEditor?.getHTML()) {
      tiptapEditor?.commands.setContent(value);
    }
  });

  onMount(() => {
    tiptapEditor = new Editor({
      element,
      extensions: [
        BubbleMenu.configure({ element: bMenu, tippyOptions: { duration: 100 } }),
        CharacterCount,
        StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
        Underline,
      ],
      editorProps: {
        attributes: {
          class:
            'textarea prose prose-md min-h-[400px] max-w-none p-3 dark:prose-invert focus:outline-none',
        },
      },
      content: typeof value === 'string' ? value : '',
      onCreate: ({ editor }) => {
        // Force rerender
        tiptapEditor = undefined;
        tiptapEditor = editor;
      },
      onUpdate: ({ editor }) => {
        value = editor.getHTML();

        // Force rerender
        tiptapEditor = undefined;
        tiptapEditor = editor;
      },
    });
  });

  onDestroy(() => {
    if (tiptapEditor) {
      tiptapEditor.destroy();
    }
  });
</script>

{#if label}
  <label for="tiptap-editor" class="label">
    <span>{label}</span>
  </label>
{/if}

<div class="relative">
  <div>
    <div bind:this={element} id="tiptap-editor"></div>
  </div>
  <Chatbot bind:value />
</div>

<div bind:this={bMenu}>
  {#if tiptapEditor}
    <CustomBubbleMenu bind:editor={tiptapEditor} />
  {/if}
</div>

{#if tiptapEditor}
  <span class="text-sm text-gray-500">
    {tiptapEditor.storage.characterCount.characters()} characters,
    {tiptapEditor.storage.characterCount.words()} words.
  </span>
{/if}
