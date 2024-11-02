<script lang="ts">
	import { enhance } from '$app/forms';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data } = $props();
	let posts = $state(data.posts);

	const modalStore = getModalStore();

	const deletePost: SubmitFunction = async ({ formData, cancel }) => {
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return cancel();
		}

		const post = posts.find((p) => p.id === parseInt(id));

		const confirmed = await new Promise((resolve) => {
			const confirmModal: ModalSettings = {
				type: 'confirm',
				title: 'Delete Post',
				body: `Are you sure you want to delete "${post?.title}"?`,
				response: resolve,
			};
			modalStore.trigger(confirmModal);
		});

		if (!confirmed) {
			return cancel();
		}

		return () => {
			posts = posts.filter((p) => p.id !== parseInt(id));
		};
	};
</script>

<div class="mb-3 flex w-full justify-between">
	<h1 class="h3 font-bold">Posts</h1>

	<a href="posts/edit" class="variant-filled-primary btn">Add New</a>
</div>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th class="table-cell-fit">
					<input class="checkbox" type="checkbox" />
				</th>
				<th>Title</th>
				<th class="table-cell-fit">Author</th>
				<th class="table-cell-fit">Date</th>
				<th class="table-cell-fit"></th>
			</tr>
		</thead>
		<tbody>
			{#each posts as post}
				<tr>
					<td class="table-cell-fit text-center !align-middle">
						<input class="checkbox" type="checkbox" />
					</td>
					<td class="!align-middle">
						<a href={`posts/${post.id}`} class="anchor">{post.title}</a>
					</td>
					<td class="table-cell-fit whitespace-nowrap !align-middle">{post.userName}</td>
					<td class="table-cell-fit !align-middle">{post.updatedAt?.toLocaleString()}</td>
					<td class="table-cell-fit whitespace-nowrap text-right !align-middle">
						<a href={`posts/${post.id}`} class="btn-icon" aria-label="Edit Post">
							<span><i class="fa-solid fa-pencil"></i></span>
						</a>
						<form action="?/delete" method="post" use:enhance={deletePost} class="inline">
							<input type="hidden" name="id" value={post.id} />
							<button class="btn-icon" aria-label="Delete Post">
								<span><i class="fa-solid fa-trash"></i> </span></button
							>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th colspan="4">
					<input class="checkbox" type="checkbox" />
				</th>
				<td class="table-cell-fit whitespace-nowrap text-right">
					<button class="btn-icon" aria-label="Previous Posts">
						<span><i class="fa-solid fa-arrow-left"></i></span>
					</button>
					1/1
					<button class="btn-icon" aria-label="Next Posts">
						<span><i class="fa-solid fa-arrow-right"></i></span>
					</button>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
