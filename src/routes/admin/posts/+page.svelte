<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		getModalStore,
		type ModalSettings,
		type PaginationSettings,
		Paginator,
	} from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { CREATE_POST_ID } from './[postId]/mode';

	let { data } = $props();
	let posts = $state(data.posts);

	const modalStore = getModalStore();

	let paginationSettings = $state<PaginationSettings>({
		page: data.page - 1,
		limit: data.limit,
		size: data.postsCount,
		amounts: [5, 10, 25],
	});

	const onPageChange = (e: CustomEvent) => {
		const page = e.detail;
		goto(`?page=${page + 1}&limit=${data.limit}`);
	};

	const onPageLimitChange = (e: CustomEvent) => {
		const limit = e.detail;
		goto(`?page=${data.page}&limit=${limit}`);
	};

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

	<a href="posts/{CREATE_POST_ID}" class="variant-filled-primary btn">Add New</a>
</div>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th class="table-cell-fit text-center">
					<input class="checkbox" type="checkbox" />
				</th>
				<th>Title</th>
				<th class="table-cell-fit text-center">Author</th>
				<th class="table-cell-fit text-center">Date</th>
				<th class="table-cell-fit text-center">Status</th>
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
					<td class="table-cell-fit whitespace-nowrap text-center !align-middle">
						{post.userName}
					</td>
					<td class="table-cell-fit text-center !align-middle">
						{post.updatedAt?.toLocaleString()}
					</td>
					<td class="table-cell-fit whitespace-nowrap text-center !align-middle">{post.status}</td>
					<td class="table-cell-fit !align-middle">
						<div class="flex justify-end">
							<a href={`posts/${post.id}`} class="btn-icon" aria-label="Edit Post">
								<span><i class="fa-solid fa-pencil"></i></span>
							</a>
							<form action="?/delete" method="post" use:enhance={deletePost} class="inline">
								<input type="hidden" name="id" value={post.id} />
								<button class="btn-icon" aria-label="Delete Post">
									<span><i class="fa-solid fa-trash"></i> </span></button
								>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th class="text-center">
					<input class="checkbox" type="checkbox" />
				</th>
				<th colspan="2"></th>
				<th colspan="3" class="table-cell-fit whitespace-nowrap text-right">
					<Paginator
						bind:settings={paginationSettings}
						on:page={onPageChange}
						on:amount={onPageLimitChange}
						showNumerals
						maxNumerals={1}
					></Paginator>
				</th>
			</tr>
		</tfoot>
	</table>
</div>
