<script lang="ts">
	let { data } = $props();
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
			{#each data.posts as post}
				<tr>
					<td class="table-cell-fit text-center">
						<input class="checkbox" type="checkbox" />
					</td>
					<td>{post.title}</td>
					<td class="table-cell-fit whitespace-nowrap">{post.userName}</td>
					<td class="table-cell-fit">{post.createdAt?.toLocaleString()}</td>
					<td class="table-cell-fit whitespace-nowrap text-right">
						<button class="btn btn-icon" aria-label="Edit Post">
							<i class="fa-solid fa-pencil"></i>
						</button>
						<button class="btn btn-icon" aria-label="Delete Post">
							<i class="fa-solid fa-trash"></i>
						</button>
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
					<button class="btn btn-icon" aria-label="Previous Posts">
						<i class="fa-solid fa-arrow-left"></i>
					</button>
					1/1
					<button class="btn btn-icon" aria-label="Next Posts">
						<i class="fa-solid fa-arrow-right"></i>
					</button>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
