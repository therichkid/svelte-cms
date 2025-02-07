import { db } from '$lib/server/db';
import { session as sessionTable, user as userTable } from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSession>>;

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_EXPIRES_IN_DAYS = 30;

const generateSessionToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const token = encodeBase32LowerCaseNoPadding(bytes);

  return token;
};

const getExpiresAt = () => {
  return new Date(Date.now() + DAY_IN_MS * SESSION_EXPIRES_IN_DAYS);
};

export const createSession = async (userId: number) => {
  const token = generateSessionToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const [session] = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      expiresAt: getExpiresAt(),
    })
    .returning({
      id: sessionTable.id,
      userId: sessionTable.userId,
      expiresAt: sessionTable.expiresAt,
    });

  return session;
};

export const validateSession = async (sessionId: string) => {
  const [result] = await db
    .select({
      user: { id: userTable.id, name: userTable.name },
      session: { id: sessionTable.id, expiresAt: sessionTable.expiresAt },
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (!result) {
    return { session: null, user: null };
  }
  const { session, user } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(sessionTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionTable.id, session.id));
  }

  return { session, user };
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};
