<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import Underline from '@tiptap/extension-underline';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import CustomBubbleMenu from './BubbleMenu.svelte';

	let { value = $bindable() }: { value: string } = $props();

	let editor = $state<Editor | null>(null);

	let element: HTMLElement;
	let bMenu: HTMLElement;

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Underline,
				BubbleMenu.configure({ element: bMenu, tippyOptions: { duration: 100 } }),
			],
			editorProps: {
				attributes: {
					class: 'textarea textarea-bordered prose prose-lg w-full max-w-none min-h-[300px]',
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

<div bind:this={bMenu}>
	{#if editor}
		<CustomBubbleMenu bind:editor />
	{/if}
</div>

<div bind:this={element}></div>
