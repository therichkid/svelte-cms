import { SESSION_COOKIE_NAME } from '$lib/server/auth/cookie';
import { invalidateSession } from '$lib/server/auth/session';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return { user: event.locals.user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

		return redirect(302, '/');
	},
};
