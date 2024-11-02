import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z
			.string({ required_error: 'Please enter a username' })
			.min(1, { message: 'Please enter a username' })
			.max(100, { message: 'Username must be less than 64 characters long' }),
		email: z
			.string({ required_error: 'Please enter an email' })
			.email({ message: 'Please enter a valid email' })
			.max(100, { message: 'Email must be less than 64 characters long' }),
		password: z
			.string({ required_error: 'Please enter a password' })
			.min(6, { message: 'Password must be at least 6 characters long' })
			.max(100, { message: 'Password must be less than 32 characters long' }),
		confirmPassword: z
			.string({ required_error: 'Please enter a password' })
			.min(6, { message: 'Password must be at least 6 characters long' })
			.max(100, { message: 'Password must be less than 32 characters long' }),
		firstName: z
			.string()
			.max(100, { message: 'First name must be less than than 64 characters long' })
			.optional()
			.transform((v) => v || null),
		lastName: z
			.string()
			.max(100, { message: 'Last name must be less than than 64 characters long' })
			.optional()
			.transform((v) => v || null),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword'],
			});
		}
	});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type RegisterSchemaKey = keyof RegisterSchema;
