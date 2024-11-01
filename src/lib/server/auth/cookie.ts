import { dev } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';
import type { Session } from '../db/schema';

export const SESSION_COOKIE_NAME = 'auth-session';

export const setAuthCookie = (event: RequestEvent, session: Pick<Session, 'id' | 'expiresAt'>) => {
	event.cookies.set(SESSION_COOKIE_NAME, session.id, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		expires: session.expiresAt,
		secure: !dev,
	});
};

export const clearAuthCookie = (event: RequestEvent) => {
	event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
};
