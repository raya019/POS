import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { voucherSchema } from '$lib/schemas/voucher.schema';
import { db } from '$lib/server/db';
import { vouchers, products, voucherProducts } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allProducts = await db
		.select({ id: products.id, name: products.name, code: products.code })
		.from(products);
	return {
		form: await superValidate(zod4(voucherSchema)),
		products: allProducts
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(voucherSchema));
		if (!form.valid) return fail(400, { form });

		// Validasi Kode Unik
		const existing = await db.query.vouchers.findFirst({
			where: eq(vouchers.code, form.data.code)
		});
		if (existing) {
			return message(form, 'Kode voucher sudah digunakan.', { status: 400 });
		}

		await db.transaction(async (tx) => {
			const [newVoucher] = await tx
				.insert(vouchers)
				.values({
					code: form.data.code,
					discountType: form.data.discountType,
					discountValue: form.data.discountValue,
					minPurchase: form.data.minPurchase,
					validFrom: form.data.validFrom || null,
					validUntil: form.data.validUntil || null
				})
				.returning();

			// Handle Produk Tertentu
			if (!form.data.applyToAll && form.data.productIds.length > 0) {
				const insertData = form.data.productIds.map((pid) => ({
					voucherId: newVoucher.id,
					productId: pid
				}));
				await tx.insert(voucherProducts).values(insertData);
			}
		});

		throw redirect(303, '/admin/voucher');
	}
};
