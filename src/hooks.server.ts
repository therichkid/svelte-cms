import { clearAuthCookie, SESSION_COOKIE_NAME, setAuthCookie } from '$lib/server/auth/cookie';
import { validateSession } from '$lib/server/auth/session';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const { user, session } = await getUserAndSession(event);

	event.locals.user = user;
	event.locals.session = session;

	if (session) {
		setAuthCookie(event, session);
	} else {
		clearAuthCookie(event);
	}

	if (event.url.pathname.startsWith('/admin') && !user) {
		return redirect(302, '/login');
	}

	return resolve(event);
};

const getUserAndSession = async (event: RequestEvent) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

	if (!sessionId) {
		return { user: null, session: null };
	}

	return await validateSession(sessionId);
};

export const handle: Handle = handleAuth;
