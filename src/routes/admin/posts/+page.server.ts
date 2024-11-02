import { db } from '$lib/server/db';
import { post as postTable, user as userTable } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { asc, count, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const limit = parseInt(url.searchParams.get('limit') ?? '10');
	const offset = (page - 1) * limit;

	const [{ count: postsCount }] = await db.select({ count: count() }).from(postTable);

	const posts = await db
		.select({
			id: postTable.id,
			createdAt: postTable.createdAt,
			updatedAt: postTable.updatedAt,
			title: postTable.title,
			content: postTable.content,
			status: postTable.status,
			userName: userTable.name,
		})
		.from(postTable)
		.leftJoin(userTable, eq(postTable.userId, userTable.id))
		.limit(limit)
		.offset(offset)
		.orderBy(asc(postTable.createdAt));

	return { posts, postsCount, page, limit };
};

export const actions: Actions = {
	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400);
		}

		await db.delete(postTable).where(eq(postTable.id, parseInt(id)));

		return { status: 204 };
	},
};
