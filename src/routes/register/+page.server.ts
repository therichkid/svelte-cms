import { setAuthCookie } from '$lib/server/auth/cookie';
import { hashPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from './schema';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		const { data, success, error } = registerSchema.safeParse(formData);

		if (!success) {
			const { fieldErrors } = error.flatten();

			const { username, email } = formData;
			return fail(400, {
				data: { username, email, password: '', confirmPassword: '' },
				fieldErrors,
			});
		}

		const { username, email, password } = data;

		const existingUser = await db
			.select({ id: userTable.id })
			.from(userTable)
			.where(eq(userTable.name, username));

		if (existingUser.length) {
			return fail(400, {
				data: { username, email, password: '', confirmPassword: '' },
				formErrors: ['Username already exists. Please try another one...'],
			});
		}

		const passwordHash = await hashPassword(password);

		try {
			const [{ id: userId }] = await db
				.insert(userTable)
				.values({ name: username, email, passwordHash })
				.returning({ id: userTable.id });

			const session = await createSession(userId);
			setAuthCookie(event, session);
		} catch {
			return fail(500, {
				data: { username, email, password: '', confirmPassword: '' },
				formErrors: ['An unknown error occurred. Please try again later...'],
			});
		}

		return redirect(302, '/admin');
	},
};
