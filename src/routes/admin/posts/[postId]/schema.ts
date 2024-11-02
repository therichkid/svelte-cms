import { z } from 'zod';

export const postSchema = z.object({
	userId: z.number({ required_error: 'Please select a user' }),
	title: z
		.string({ required_error: 'Please enter a title' })
		.min(1, { message: 'Please enter a title' })
		.max(255, { message: 'Title must be less than 255 characters long' }),
	content: z
		.string({ required_error: 'Please enter content' })
		.min(1, { message: 'Please enter content' }),
	excerpt: z
		.string()
		.max(1000, { message: 'Excerpt must be less than 1000 characters long' })
		.optional()
		.transform((v) => v || null),
	status: z.enum(['draft', 'published', 'archived'], {
		required_error: 'Please select a status',
		message: 'Status must be either draft, published or archived',
	}),
});

export type PostSchema = z.infer<typeof postSchema>;

export type PostSchemaKey = keyof PostSchema;
