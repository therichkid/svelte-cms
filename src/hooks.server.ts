import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.SESSION_COOKIE_NAME);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session) {
		event.cookies.set(auth.SESSION_COOKIE_NAME, session.id.toString(), {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev,
		});
	} else {
		event.cookies.delete(auth.SESSION_COOKIE_NAME, { path: '/' });
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
