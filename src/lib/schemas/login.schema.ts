import { z } from 'zod';

export const LoginSchema = z.object({
	username: z.string().min(3, 'Username minimal 3 karakter'),
	password: z.string().min(8, 'Password minimal 6 karakter')
});

export type ProductSchema = z.infer<typeof LoginSchema>;
