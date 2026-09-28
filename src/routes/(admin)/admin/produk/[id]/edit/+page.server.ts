import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { productSchema } from '$lib/schemas/product.schema';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) error(404, 'Produk tidak ditemukan');

	const [product] = await db.select().from(products).where(eq(products.id, id));
	if (!product) error(404, 'Produk tidak ditemukan');

	const form = await superValidate(product, zod4(productSchema));
	
	return {
		form,
		productName: product.name
	};
};

export const actions: Actions = {
	default: async (event) => {
		const id = parseInt(event.params.id);
		if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

		const form = await superValidate(event, zod4(productSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.update(products).set(form.data).where(eq(products.id, id));
		} catch (err: any) {
			if (err.message && err.message.toLowerCase().includes('unique')) {
				return fail(400, { form, message: 'Kode atau Barcode sudah digunakan oleh produk lain.' });
			}
			return fail(500, { form, message: 'Terjadi kesalahan sistem.' });
		}

		redirect(302, '/admin/produk');
	}
};
