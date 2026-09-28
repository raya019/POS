import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { productSchema } from '$lib/schemas/product.schema';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(productSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(productSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(products).values(form.data);
		} catch (error: any) {
			if (error.message && error.message.toLowerCase().includes('unique')) {
				return fail(400, { form, message: 'Kode atau Barcode sudah terdaftar.' });
			}
			return fail(500, { form, message: 'Terjadi kesalahan sistem.' });
		}

		redirect(302, '/admin/produk');
	}
};
