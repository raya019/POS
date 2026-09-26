import { z } from 'zod';

export const userSchema = z.object({
	username: z.string().min(3, 'Username minimal 3 karakter'),
	name: z.string().min(1, 'Nama wajib diisi'),
	password: z.string().min(6, 'Password minimal 6 karakter')
});

export const userEditSchema = z.object({
	username: z.string().min(3, 'Username minimal 3 karakter'),
	name: z.string().min(1, 'Nama wajib diisi')
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserEditSchema = z.infer<typeof userEditSchema>;
