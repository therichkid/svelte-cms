<script lang="ts">
	import ElementPicker from '$components/FormBuilder/ElementPicker.svelte';
	import { FORM_ELEMENTS, FormElementRef } from '$lib/models/form-builder/elements';
	import type { FormTree } from '$lib/models/form-builder/form';
	import type { FormNode } from '$lib/models/form-builder/nodes';
	import { createNodeFromElement } from '$utils/formBuilder';
	import { capitalize } from '$utils/string';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let formTree: FormTree = $state<FormTree>({
		id: '1',
		name: 'Form 1',
		nodes: [
			{
				id: '1',
				ref: FormElementRef.Heading,
				text: 'Participant Information',
				cssClasses: 'h3',
				containerCssClasses: 'col-span-2',
			},
			{
				id: '2',
				ref: FormElementRef.Paragraph,
				text: 'Please fill out the form below to register for the event.',
				containerCssClasses: 'col-span-2',
			},
			{
				id: '3',
				ref: FormElementRef.Input,
				name: 'first_name',
				label: 'First Name',
				type: 'text',
			},
			{
				id: '4',
				ref: FormElementRef.Input,
				name: 'last_name',
				label: 'Last Name',
				type: 'text',
			},
			{
				id: '5',
				ref: FormElementRef.Input,
				name: 'email',
				label: 'Email',
				type: 'email',
			},
			{
				id: '6',
				ref: FormElementRef.Date,
				name: 'dob',
				label: 'Date of Birth',
				includeTime: false,
			},
			{
				id: '7',
				ref: FormElementRef.Button,
				name: 'submit',
				label: 'Submit',
				action: 'submit',
				cssClasses: 'variant-filled-primary',
			},
		],
	});

	let isEditingFormTreeName = $state(false);

	let formTreeRef: HTMLElement;

	let selectedNode = $state<FormNode | null>(null);
	let highlightedNodeId = $state<string | null>(null);

	onMount(() => {
		Sortable.create(formTreeRef, {
			group: 'form-elements',
			animation: 150,

			onAdd: (event) => {
				const { item, oldIndex, newIndex } = event;
				if (oldIndex === undefined || newIndex === undefined) return;

				// Remove the cloned sortablejs element as it wasn't added to the createdForm elements
				item.parentNode?.removeChild(event.item);

				// Add the form element manually
				const formElement = FORM_ELEMENTS[oldIndex];
				const formNode = createNodeFromElement(formElement);
				formTree.nodes = [
					...formTree.nodes.slice(0, newIndex),
					formNode,
					...formTree.nodes.slice(newIndex),
				];
			},
		});
	});

	const openSettings = (event: MouseEvent, node: FormNode) => {
		selectedNode = node;

		event.stopPropagation();
		document.body.addEventListener('click', closeSettings);
	};

	const closeSettings = () => {
		selectedNode = null;

		document.body.removeEventListener('click', closeSettings);
	};
</script>

<div class="grid-row grid h-full grid-cols-[240px_1fr_auto] gap-4">
	<ElementPicker></ElementPicker>

	<div class="flex flex-col items-center">
		<header class="my-4 flex items-center">
			{#if isEditingFormTreeName}
				<input
					type="text"
					bind:value={formTree.name}
					autofocus
					onblur={() => (isEditingFormTreeName = false)}
					class="input"
				/>
			{:else}
				<h1 class="h3">{formTree.name}</h1>
				<button
					onclick={() => (isEditingFormTreeName = true)}
					class="btn-icon ml-1"
					aria-label="Edit form name"
				>
					<span class="text-gray-500"><i class="fa fa-pencil"></i></span>
				</button>
			{/if}
		</header>

		<section
			bind:this={formTreeRef}
			class="grid h-full w-full max-w-screen-lg auto-rows-max grid-cols-1 gap-4 p-4 md:grid-cols-2"
			role="list"
		>
			{#each formTree.nodes as node}
				<!-- TODO: Remove aria-hidden -->
				<div
					onclick={(event) => openSettings(event, node)}
					onmouseenter={() => (highlightedNodeId = node.id)}
					onmouseleave={() => (highlightedNodeId = null)}
					class="flex w-full cursor-pointer items-center gap-4 rounded-md bg-surface-900 p-4 hover:bg-surface-800 {node.containerCssClasses}"
					role="listitem"
					aria-hidden="true"
				>
					<span
						class="cursor-move pr-3 text-gray-500 transition-opacity duration-300 ease-in-out"
						class:opacity-0={highlightedNodeId !== node.id}
						class:opacity-100={highlightedNodeId === node.id}
					>
						<i class="fa-solid fa-grip-vertical"></i>
					</span>

					<div class="w-full">
						<!-- Heading -->
						{#if node.ref === FormElementRef.Heading}
							<h2 class="text-center {node.cssClasses}">{node.text}</h2>

							<!-- Paragraph -->
						{:else if node.ref === FormElementRef.Paragraph}
							<p>{node.text}</p>

							<!-- Input -->
						{:else if node.ref === FormElementRef.Input}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<input type={node.type} name={node.name} class="input {node.cssClasses}" />
							</label>

							<!-- Date -->
						{:else if node.ref === FormElementRef.Date}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<input
									name={node.name}
									type={node.includeTime ? 'datetime-local' : 'date'}
									class="input {node.cssClasses}"
								/>
							</label>

							<!-- Textarea -->
						{:else if node.ref === FormElementRef.Textarea}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<textarea name={node.name} rows={node.rows ?? 4} class="textarea {node.cssClasses}"
								></textarea>
							</label>

							<!-- Select -->
						{:else if node.ref === FormElementRef.Select}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<select name={node.name} multiple={node.multiple} class="select {node.cssClasses}">
									{#each node.options as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
							</label>

							<!-- Checkbox -->
						{:else if node.ref === FormElementRef.Checkbox}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<div class="space-y-2">
									{#each node.options as option}
										<label class="flex items-center space-x-2">
											<input type="checkbox" name={option} class="checkbox" />
											<span>{option}</span>
										</label>
									{/each}
								</div>
							</label>

							<!-- Radio -->
						{:else if node.ref === FormElementRef.Radio}
							<label class="label">
								{#if node.label}
									<span>{node.label}</span>
								{/if}
								<div class="space-y-2">
									{#each node.options as option}
										<label class="flex items-center space-x-2">
											<input type="radio" name={node.name} value={option} class="radio" />
											<span>{option}</span>
										</label>
									{/each}
								</div>
							</label>

							<!-- Button -->
						{:else if node.ref === FormElementRef.Button}
							<button type={node.action} class="btn {node.cssClasses}">{node.label}</button>
						{/if}
					</div>

					<button
						class="btn-icon transition-opacity duration-300 ease-in-out"
						class:opacity-0={highlightedNodeId !== node.id}
						class:opacity-100={highlightedNodeId === node.id}
						aria-label="Delete form field"
					>
						<span class="text-gray-500 hover:text-error-500"
							><i class="fa-solid fa-trash"></i>
						</span>
					</button>
				</div>
			{/each}
		</section>
	</div>

	{#if selectedNode}
		<div
			onclick={(event) => event.stopPropagation()}
			class="card w-[320px]"
			in:fly={{ x: 100 }}
			out:fly={{ x: 100 }}
			aria-hidden="true"
		>
			<header class="card-header mb-2 flex items-center justify-between">
				<h3 class="h4">{capitalize(selectedNode.ref)} Settings</h3>
				<button onclick={() => closeSettings()} class="btn-icon" aria-label="Close settings">
					<span><i class="fa fa-xmark"></i> </span>
				</button>
			</header>
			<section class="flex flex-col gap-4 p-4">
				<!-- TODO -->
			</section>
		</div>
	{/if}
</div>
