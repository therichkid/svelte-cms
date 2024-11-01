import { z } from 'zod';

export const loginSchema = z.object({
	username: z
		.string({ required_error: 'Please enter your username' })
		.min(1, { message: 'Please enter your username' }),
	password: z
		.string({ required_error: 'Please enter your password' })
		.min(1, { message: 'Please enter your password' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export type LoginSchemaKey = keyof LoginSchema;
