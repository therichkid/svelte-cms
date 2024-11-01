export const setAuthCookie = (event: RequestEvent, session: Pick<Session, 'id' | 'expiresAt'>) => {
	event.cookies.set(auth.SESSION_COOKIE_NAME, session.id, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		expires: session.expiresAt,
		secure: !dev,
	});
};
