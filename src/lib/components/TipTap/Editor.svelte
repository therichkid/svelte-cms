<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import CharacterCount from '@tiptap/extension-character-count';
	import Underline from '@tiptap/extension-underline';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import CustomBubbleMenu from './BubbleMenu.svelte';
	import Chatbot from './Chatbot.svelte';

	let { label, value = $bindable() }: { label?: string; value: string } = $props();

	let tiptapEditor = $state<Editor | undefined>(undefined);

	let element: HTMLElement;
	let bMenu: HTMLElement;

	$effect(() => {
		if (value !== tiptapEditor?.getHTML()) {
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
			content: value,
			onUpdate: ({ editor }) => {
				// Force rerender
				tiptapEditor = undefined;
				tiptapEditor = editor;

				value = editor.getHTML();
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

<div>
	<div bind:this={element} id="tiptap-editor"></div>
</div>

<div bind:this={bMenu}>
	{#if tiptapEditor}
		<CustomBubbleMenu bind:editor={tiptapEditor} />
	{/if}
</div>

{#if tiptapEditor}
	<div class="mt-1 flex items-start justify-between">
		<span class="text-sm text-gray-500">
			{tiptapEditor.storage.characterCount.characters()} characters,
			{tiptapEditor.storage.characterCount.words()} words.
		</span>
		<Chatbot bind:value />
	</div>
{/if}
