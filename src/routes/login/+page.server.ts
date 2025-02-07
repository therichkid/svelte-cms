import { setAuthCookie } from '$lib/server/auth/cookie';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    const { data, success, error } = loginSchema.safeParse(formData);

    if (!success) {
      const { fieldErrors } = error.flatten();

      const { username } = formData;
      return fail(400, { data: { username, password: '' }, fieldErrors });
    }

    const { username, password } = data;

    const existingUser = await db
      .select({ id: userTable.id, passwordHash: userTable.passwordHash })
      .from(userTable)
      .where(or(eq(userTable.name, username), eq(userTable.email, username)));

    if (!existingUser.length) {
      return fail(400, {
        data: { username, password: '' },
        formErrors: ['Incorrect username or password. Please try again...'],
      });
    }

    const [{ id: userId, passwordHash }] = existingUser;

    const validPassword = await verifyPassword(password, passwordHash);
    if (!validPassword) {
      return fail(400, {
        data: { username, password: '' },
        formErrors: ['Incorrect username or password. Please try again...'],
      });
    }

    const session = await createSession(userId);
    setAuthCookie(event, session);

    return redirect(302, '/admin');
  },
};
