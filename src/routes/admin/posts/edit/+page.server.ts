import { db } from '$lib/server/db';
import { post as postTable, type Post } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const id = event.url.searchParams.get('id');

	if (id) {
		const [post] = await db
			.select({
				createdAt: postTable.createdAt,
				updatedAt: postTable.updatedAt,
				title: postTable.title,
				content: postTable.content,
				status: postTable.status,
			})
			.from(postTable)
			.where(eq(postTable.id, parseInt(id)));

		return { mode: 'UPDATE', post };
	}

	return { mode: 'CREATE' };
};

export const actions: Actions = {
	submit: async (event) => {
		const id = event.url.searchParams.get('id');

		const formData = await event.request.formData();
		const title = formData.get('title');
		const content = formData.get('content');
		const status = formData.get('status') ?? 'draft';

		if (!validateTitle(title)) {
			return fail(400, { message: 'Invalid title' });
		}
		if (!validateContent(content)) {
			return fail(400, { message: 'Invalid content' });
		}
		if (!validateStatus(status)) {
			return fail(400, { message: 'Invalid status' });
		}

		if (id) {
			await db
				.update(postTable)
				.set({ title, content, status })
				.where(eq(postTable.id, parseInt(id)));
		} else {
			await db.insert(postTable).values({ title, content, status, userId: event.locals.user!.id });
		}

		return redirect(302, '/admin/posts');
	},

	cancel: () => {
		return redirect(302, '/admin/posts');
	},
};

const validateTitle = (title: unknown): title is string => {
	return typeof title === 'string' && title.length > 0 && title.length <= 255;
};

const validateContent = (content: unknown): content is string => {
	return typeof content === 'string' && content.length > 0;
};

const validateStatus = (status: unknown): status is Post['status'] => {
	return typeof status === 'string' && ['draft', 'published', 'archived'].includes(status);
};
