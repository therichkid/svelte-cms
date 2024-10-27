<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import Underline from '@tiptap/extension-underline';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	let { value = $bindable() }: { value: string } = $props();

	let editor = $state<Editor | null>(null);
	let activeNodes = $state<Set<string>>(new Set());

	let element: HTMLElement;
	let bMenu: HTMLElement;

	onMount(() => {
		editor = new Editor({
			element: element,
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
			onTransaction: () => {
				updateActiveNodes();
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

	const updateActiveNodes = () => {
		const nodes = new Set<string>();

		if (!editor) {
			activeNodes = nodes;
			return;
		}

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

<div bind:this={bMenu}>
	{#if editor}
		<div class="join">
			<select class="join-item select select-bordered">
				<option
					onclick={() => editor?.chain().focus().setParagraph().run()}
					selected={activeNodes.has('paragraph')}
				>
					Paragraph
				</option>
				<option
					onclick={() => editor?.chain().focus().setHeading({ level: 1 }).run()}
					selected={activeNodes.has('heading-1')}
				>
					Heading 1
				</option>
				<option
					onclick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}
					selected={activeNodes.has('heading-2')}
				>
					Heading 2
				</option>
				<option
					onclick={() => editor?.chain().focus().setHeading({ level: 3 }).run()}
					selected={activeNodes.has('heading-3')}
				>
					Heading 3
				</option>
				<option
					onclick={() => editor?.chain().focus().setHeading({ level: 4 }).run()}
					selected={activeNodes.has('heading-4')}
				>
					Heading 4
				</option>
			</select>

			<button
				onclick={() => editor?.chain().focus().toggleBold().run()}
				class:btn-primary={activeNodes.has('bold')}
				class="btn join-item"
				aria-label="Bold"
			>
				<i class="fa-solid fa-bold"></i>
			</button>
			<button
				onclick={() => editor?.chain().focus().toggleItalic().run()}
				class:btn-primary={activeNodes.has('italic')}
				class="btn join-item"
				aria-label="Italic"
			>
				<i class="fa-solid fa-italic"></i>
			</button>
			<button
				onclick={() => editor?.chain().focus().toggleUnderline().run()}
				class:btn-primary={activeNodes.has('underline')}
				class="btn join-item"
				aria-label="Underline"
			>
				<i class="fa-solid fa-underline"></i>
			</button>
			<button
				onclick={() => editor?.chain().focus().toggleStrike().run()}
				class:btn-primary={activeNodes.has('strike')}
				class="btn join-item"
				aria-label="Strike"
			>
				<i class="fa-solid fa-strikethrough"></i>
			</button>
		</div>
	{/if}
</div>

<div bind:this={element}></div>
