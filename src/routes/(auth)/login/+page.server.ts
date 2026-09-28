import { LoginSchema } from '$lib/schemas/login.schema.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		if (locals.user.role === 'admin_owner') {
			throw redirect(302, '/admin');
		} else {
			throw redirect(302, '/transaksi');
		}
	}

	return {
		form: await superValidate(zod4(LoginSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(LoginSchema));
		if (!form.valid) return fail(400, { form });

		let redirectTo = '/transaksi';
		// Memanggil internal API better-auth tanpa melakukan fetch HTTP
		try {
			const res = await auth.api.signInUsername({
				body: {
					username: form.data.username,
					password: form.data.password
				},
				headers: request.headers
			});

			if (res?.user?.role === 'admin_owner') {
				redirectTo = '/admin';
			}
		} catch (error) {
			if (error instanceof APIError) {
				return message(form, error.message, {
					status: 400
				});
			}
			return message(form, 'Internal Server Error', { status: 500 });
		}

		redirect(302, redirectTo);
	}
};
