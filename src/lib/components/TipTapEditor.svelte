<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	let element: HTMLElement;
	let editor = $state<Editor | null>(null);

	let { value = $bindable() }: { value: string } = $props();

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class: 'textarea textarea-bordered prose prose-lg w-full max-w-none min-h-[300px]',
				},
			},
			content: value,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

{#if editor}
	<div class="join mb-2">
		<input
			type="radio"
			name="tags"
			onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
			checked={editor.isActive('heading', { level: 1 })}
			class="btn join-item"
			aria-label="H1"
		/>
		<input
			type="radio"
			name="tags"
			onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
			checked={editor.isActive('heading', { level: 2 })}
			class="btn join-item"
			aria-label="H2"
		/>
		<input
			type="radio"
			name="tags"
			onclick={() => editor?.chain().focus().setParagraph().run()}
			checked={editor.isActive('paragraph')}
			class="btn join-item"
			aria-label="P"
		/>
	</div>
{/if}

<div bind:this={element}></div>
