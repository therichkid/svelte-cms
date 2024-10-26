import { sql } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['viewer', 'editor', 'admin']);

export const user = pgTable('users', {
	id: serial('id').unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`current_timestamp`),
	name: varchar('username', { length: 255 }).notNull().unique(),
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRole('role').notNull().default('viewer'),
});

export type User = typeof user.$inferSelect;

export const session = pgTable('sessions', {
	id: serial('id').unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`current_timestamp`),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export type Session = typeof session.$inferSelect;

export const postStatus = pgEnum('post_status', ['draft', 'published', 'archived']);

export const post = pgTable('posts', {
	id: serial('id').unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`current_timestamp`),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	content: text('content').notNull(),
	status: postStatus('status').notNull().default('draft'),
});

export type Post = typeof post.$inferSelect;

export const page = pgTable('pages', {
	id: serial('id').unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`current_timestamp`),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	content: text('content').notNull(),
	status: postStatus('status').notNull().default('draft'),
});

export type Page = typeof page.$inferSelect;
