import { deleteAuthCookie } from '$lib/server/auth/cookie';
import { invalidateSession } from '$lib/server/auth/session';
import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session } = event.locals;
	if (!session) {
		return error(401, { message: 'Unauthorized' });
	}

	await invalidateSession(session.id);
	deleteAuthCookie(event);

	return redirect(302, '/');
};
