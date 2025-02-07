import { db } from '$lib/server/db';
import { post as postTable, user as userTable } from '$lib/server/db/schema';
import { slugify } from '$utils/slug';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { isUpdatePost, PostMode } from './mode';
import { postSchema } from './schema';

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
        excerpt: postTable.excerpt,
        status: postTable.status,
      })
      .from(postTable)
      .where(eq(postTable.id, parseInt(postId)));

    return { mode: PostMode.UPDATE, post, users };
  }

  return { mode: PostMode.CREATE, users };
};

export const actions: Actions = {
  default: async (event) => {
    const { postId } = event.params;

    const formData = Object.fromEntries(await event.request.formData());

    const { data, success, error } = postSchema.safeParse({
      ...formData,
      status: 'draft',
      userId: event.locals.user!.id,
    });

    if (!success) {
      const { fieldErrors } = error.flatten();
      return fail(400, { data: formData, fieldErrors });
    }

    const { title, content, excerpt, status, userId } = data;

    try {
      if (isUpdatePost(postId)) {
        await db
          .update(postTable)
          .set({ title, slug: slugify(title), content, excerpt, status })
          .where(eq(postTable.id, parseInt(postId)));
      } else {
        await db.insert(postTable).values({
          title,
          slug: slugify(title),
          content,
          excerpt,
          status,
          userId,
        });
      }
    } catch (error) {
      console.error(error);
      return fail(500, {
        data: formData,
        formErrors: ['An error occurred while saving the post. Please try again...'],
      });
    }

    return redirect(302, '/admin/posts');
  },
};
