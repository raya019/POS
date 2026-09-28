import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { stockEntrySchema } from '$lib/schemas/stock.schema';
import { db } from '$lib/server/db';
import { products, stockEntries } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allProducts = await db.select().from(products).orderBy(desc(products.id));
	return {
		form: await superValidate(zod4(stockEntrySchema)),
		products: allProducts
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(stockEntrySchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(stockEntries).values({
				productId: form.data.productId,
				quantityIn: form.data.quantityIn,
				quantityRemaining: form.data.quantityIn,
				entryDate: new Date(form.data.entryDate).toISOString(),
				createdBy: event.locals.user!.id
			});
		} catch (error: any) {
			return message(form, 'Gagal mencatat barang masuk.', { status: 500 });
		}

		return message(form, 'Stok berhasil ditambahkan!');
	}
};

