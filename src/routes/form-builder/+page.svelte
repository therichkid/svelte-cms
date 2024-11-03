<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	interface CreatedForm {
		id: number;
		name: string;
		elements: FormElement[];
	}

	interface FormElement {
		slug: string;
		label: string;
	}

	const formElements: FormElement[] = [
		{ slug: 'text-input', label: 'Text Input' },
		{ slug: 'textarea', label: 'Textarea' },
		{ slug: 'number-input', label: 'Number Input' },
		{ slug: 'date-input', label: 'Date Input' },
		{ slug: 'checkbox', label: 'Checkbox' },
		{ slug: 'radio', label: 'Radio' },
	];

	const createdForm: CreatedForm = {
		id: 1,
		name: 'Form 1',
		elements: [
			{ slug: 'text-input', label: 'Text Input' },
			{ slug: 'text-input', label: 'Text Input' },
		],
	};

	let formElementsRef: HTMLElement;
	let createdFormRef: HTMLElement;

	onMount(async function () {
		Sortable.create(formElementsRef, {
			group: {
				name: 'form-elements',
				pull: 'clone',
				put: false,
			},
			animation: 150,
			sort: false,
		});

		Sortable.create(createdFormRef, {
			group: 'form-elements',
			animation: 150,

			onAdd: (event) => {
				const { item, oldIndex, newIndex } = event;
				if (oldIndex === undefined || newIndex === undefined) return;

				// Remove the cloned sortablejs element as it wasn't added to the createdForm elements
				item.parentNode?.removeChild(event.item);

				// Add the form element manually
				const addedFormElement = formElements[oldIndex];
				createdForm.elements = [
					...createdForm.elements.slice(0, newIndex),
					addedFormElement,
					...createdForm.elements.slice(newIndex),
				];
			},
		});
	});
</script>

<div class="grid h-full grid-cols-[auto_1fr] gap-4">
	<div>
		<div class="card flex w-[240px] flex-col">
			<header class="card-header">
				<h3 class="h4">Elements</h3>
			</header>
			<section bind:this={formElementsRef} class="flex flex-col gap-4 p-4">
				{#each formElements as element}
					<div class="w-full cursor-move rounded-md bg-surface-700 p-4 hover:bg-surface-600">
						{element.label}
					</div>
				{/each}
			</section>
		</div>
	</div>

	<div class="card flex h-full flex-col items-center">
		<header class="card-header">
			<h3 class="h4">{createdForm.name}</h3>
		</header>
		<section
			bind:this={createdFormRef}
			class="flex h-full w-full max-w-screen-lg flex-col items-center gap-4 p-4"
		>
			{#each createdForm.elements as element}
				<div class="w-full cursor-move rounded-md bg-surface-700 p-4 hover:bg-surface-600">
					{element.label}
				</div>
			{/each}
		</section>
	</div>
</div>
