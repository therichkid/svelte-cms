<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import Underline from '@tiptap/extension-underline';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import CustomBubbleMenu from './BubbleMenu.svelte';
	import Chatbot from './Chatbot.svelte';

	let { label = $bindable(), value = $bindable() }: { label?: string; value: string } = $props();

	let editor = $state<Editor | null>(null);

	let element: HTMLElement;
	let bMenu: HTMLElement;

	$effect(() => {
		if (value !== editor?.getHTML()) {
			editor?.commands.setContent(value);
		}
	});

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
				Underline,
				BubbleMenu.configure({ element: bMenu, tippyOptions: { duration: 100 } }),
			],
			editorProps: {
				attributes: {
					class:
						'textarea prose prose-lg min-h-[400px] max-w-none p-3 dark:prose-invert focus:outline-none',
				},
			},
			content: value,
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

<div class="relative">
	{#if label}
		<label for="tiptap-editor" class="label">
			<span>{label}</span>
		</label>
	{/if}

	<div bind:this={element} id="tiptap-editor"></div>

	<div bind:this={bMenu}>
		{#if editor}
			<CustomBubbleMenu bind:editor />
		{/if}
	</div>

	{#if editor}
		<Chatbot bind:value />
	{/if}
</div>
