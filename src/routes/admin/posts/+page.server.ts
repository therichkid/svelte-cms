import { db } from '$lib/server/db';
import { post as postTable, user as userTable } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

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
		.limit(10)
		.orderBy(asc(postTable.createdAt));

	return { posts };
};
