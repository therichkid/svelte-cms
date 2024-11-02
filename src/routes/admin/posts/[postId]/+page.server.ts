import { db } from '$lib/server/db';
import { post as postTable, user as userTable, type Post } from '$lib/server/db/schema';
import { slugify } from '$utils/slug';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { isUpdatePost, PostMode } from './mode';

export const load: PageServerLoad = async ({ params }) => {
	const { postId } = params;

	const users = await db.select({ id: userTable.id, name: userTable.name }).from(userTable);

	if (isUpdatePost(postId)) {
		const [post] = await db
			.select({
				createdAt: postTable.createdAt,
				updatedAt: postTable.updatedAt,
				title: postTable.title,
				content: postTable.content,
				// excerpt: postTable.excerpt,
				status: postTable.status,
			})
			.from(postTable)
			.where(eq(postTable.id, parseInt(postId)));

		return { mode: PostMode.CREATE, post, users };
	}

	return { mode: PostMode.UPDATE, users };
};

export const actions: Actions = {
	submit: async (event) => {
		const { postId } = event.params;

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

		if (isUpdatePost(postId)) {
			await db
				.update(postTable)
				.set({ title, content, status })
				.where(eq(postTable.id, parseInt(postId)));
		} else {
			await db
				.insert(postTable)
				.values({ title, slug: slugify(title), content, status, userId: event.locals.user!.id });
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
