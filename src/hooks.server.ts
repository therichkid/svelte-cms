import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const { user, session } = await getUserAndSession(event);

	event.locals.user = user;
	event.locals.session = session;

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

	if (event.url.pathname.startsWith('/admin') && !user) {
		return redirect(302, '/login');
	}

	return resolve(event);
};

const getUserAndSession = async (event: RequestEvent) => {
	const sessionId = event.cookies.get(auth.SESSION_COOKIE_NAME);

	if (!sessionId) {
		return { user: null, session: null };
	}

	return await auth.validateSession(sessionId);
};

export const handle: Handle = handleAuth;
