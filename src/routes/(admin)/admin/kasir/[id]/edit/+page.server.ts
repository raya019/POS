import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userEditSchema } from '$lib/schemas/user.schema';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const [existingUser] = await db.select().from(user).where(eq(user.id, id));
	
	if (!existingUser) error(404, 'Kasir tidak ditemukan');

	const form = await superValidate({
		name: existingUser.name,
		username: existingUser.username || ''
	}, zod(userEditSchema));
	
	return {
		form,
		kasirName: existingUser.name
	};
};

export const actions: Actions = {
	default: async (event) => {
		const id = event.params.id;
		const form = await superValidate(event, zod(userEditSchema));
		
		if (!form.valid) return fail(400, { form });

		try {
			// Update profil (Sesuai D7, reset password admin bersifat manual via db, bukan UI)
			await db.update(user).set({
				name: form.data.name,
				username: form.data.username,
				email: `${form.data.username}@toko.local` // Update email sintetis jika username berubah
			}).where(eq(user.id, id));

		} catch (err: any) {
			if (err.message && err.message.toLowerCase().includes('unique')) {
				return fail(400, { form, message: 'Username sudah dipakai.' });
			}
			return fail(500, { form, message: 'Gagal menyimpan profil kasir.' });
		}

		redirect(302, '/admin/kasir');
	}
};
