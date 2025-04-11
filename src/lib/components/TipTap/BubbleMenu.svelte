<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { onDestroy, onMount } from 'svelte';

  let { editor = $bindable() }: { editor: Editor } = $props();

  let activeNodes = $state<Set<string>>(new Set());

  onMount(() => {
    editor.on('transaction', updateActiveNodes);
  });

  onDestroy(() => {
    editor.off('transaction', updateActiveNodes);
  });

  const updateActiveNodes = () => {
    const nodes = new Set<string>();

    if (editor.isActive('paragraph')) {
      nodes.add('paragraph');
    } else if (editor.isActive('heading', { level: 1 })) {
      nodes.add('heading-1');
    } else if (editor.isActive('heading', { level: 2 })) {
      nodes.add('heading-2');
    } else if (editor.isActive('heading', { level: 3 })) {
      nodes.add('heading-3');
    } else if (editor.isActive('heading', { level: 4 })) {
      nodes.add('heading-4');
    }

    if (editor.isActive('bold')) {
      nodes.add('bold');
    }
    if (editor.isActive('italic')) {
      nodes.add('italic');
    }
    if (editor.isActive('underline')) {
      nodes.add('underline');
    }
    if (editor.isActive('strike')) {
      nodes.add('strike');
    }

    activeNodes = nodes;
  };
</script>

<div class="direction card bg-surface-800 flex w-fit items-center gap-2 p-2 shadow-xl">
  <select class="select w-36">
    <option
      onclick={() => editor.chain().focus().setParagraph().run()}
      selected={activeNodes.has('paragraph')}
    >
      Paragraph
    </option>
    <option
      onclick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      selected={activeNodes.has('heading-1')}
    >
      Heading 1
    </option>
    <option
      onclick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      selected={activeNodes.has('heading-2')}
    >
      Heading 2
    </option>
    <option
      onclick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      selected={activeNodes.has('heading-3')}
    >
      Heading 3
    </option>
    <option
      onclick={() => editor.chain().focus().setHeading({ level: 4 }).run()}
      selected={activeNodes.has('heading-4')}
    >
      Heading 4
    </option>
  </select>

  <div class="btn-group">
    <button
      type="button"
      onclick={() => editor.chain().focus().toggleBold().run()}
      class="btn-icon"
      class:preset-filled-primary-500={activeNodes.has('bold')}
      aria-label="Bold"
    >
      <span><i class="fa-solid fa-bold"></i></span>
    </button>
    <button
      type="button"
      onclick={() => editor.chain().focus().toggleItalic().run()}
      class="btn-icon"
      class:preset-filled-primary-500={activeNodes.has('italic')}
      aria-label="Italic"
    >
      <span><i class="fa-solid fa-italic"></i></span>
    </button>
    <button
      type="button"
      onclick={() => editor.chain().focus().toggleUnderline().run()}
      class="btn-icon"
      class:preset-filled-primary-500={activeNodes.has('underline')}
      aria-label="Underline"
    >
      <span><i class="fa-solid fa-underline"></i></span>
    </button>
    <button
      type="button"
      onclick={() => editor.chain().focus().toggleStrike().run()}
      class="btn-icon"
      class:preset-filled-primary-500={activeNodes.has('strike')}
      aria-label="Strike"
    >
      <span><i class="fa-solid fa-strikethrough"></i></span>
    </button>
  </div>
</div>
