<script lang="ts">
	import { FORM_ELEMENTS } from '$lib/models/form-builder/elements';
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	let formElementsRef: HTMLElement;

	onMount(() => {
		Sortable.create(formElementsRef, {
			group: {
				name: 'form-elements',
				pull: 'clone',
				put: false,
			},
			animation: 150,
			sort: false,
		});
	});
</script>

<div class="card overflow-auto">
	<header class="card-header my-2">
		<h3 class="h4">Elements</h3>
	</header>
	<section bind:this={formElementsRef} class="flex flex-col gap-4 p-4">
		{#each FORM_ELEMENTS as element}
			<div class="w-full cursor-move rounded-md bg-surface-700 p-4 hover:bg-surface-600">
				<span class="text-gray-500"><i class="fa-solid fa-grip-vertical"></i></span>
				<span class="ml-3">{element.name}</span>
			</div>
		{/each}
	</section>
</div>
