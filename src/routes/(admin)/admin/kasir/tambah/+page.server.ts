import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schemas/user.schema';
import { auth } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(userSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(userSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// better-auth signUp to handle password hashing
			const res = await auth.api.signUpEmail({
				body: {
					email: `${form.data.username}@toko.local`,
					username: form.data.username,
					name: form.data.name,
					password: form.data.password
				}
			});

			if (!res?.user?.id) {
				return fail(500, {
					form,
					message: 'Gagal membuat akun kasir (username mungkin sudah terpakai).'
				});
			}
		} catch (error: any) {
			return fail(500, { form, message: error.message || 'Terjadi kesalahan internal.' });
		}

		redirect(302, '/admin/kasir');
	}
};
