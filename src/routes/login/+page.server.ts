import { dev } from '$app/environment';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user as userTable, type Session } from '$lib/server/db/schema';
import { hash, verify, type Options } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

const HASH_OPTIONS = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
} satisfies Options;

const setAuthCookie = (event: RequestEvent, session: Pick<Session, 'id' | 'expiresAt'>) => {
	event.cookies.set(auth.SESSION_COOKIE_NAME, session.id, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		expires: session.expiresAt,
		secure: !dev,
	});
};

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const [result] = await db.select().from(userTable).where(eq(userTable.name, username));

		const existingUser = result;
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, HASH_OPTIONS);
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const session = await auth.createSession(existingUser.id);
		setAuthCookie(event, session);

		return redirect(302, '/admin');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const passwordHash = await hash(password, HASH_OPTIONS);

		try {
			const [{ id: userId }] = await db
				.insert(userTable)
				.values({ name: username, passwordHash, email: '' })
				.returning({ id: userTable.id });

			const session = await auth.createSession(userId);
			setAuthCookie(event, session);
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}

		return redirect(302, '/admin');
	},
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
