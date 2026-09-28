import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { voucherSchema } from '$lib/schemas/voucher.schema';
import { db } from '$lib/server/db';
import { vouchers, products, voucherProducts } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { eq, and, ne } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const voucherId = Number(params.id);
	if (!voucherId) throw error(404, 'Voucher ID tidak valid');

	const voucher = await db.query.vouchers.findFirst({
		where: eq(vouchers.id, voucherId),
		with: { productRestrictions: true }
	});

	if (!voucher) throw error(404, 'Voucher tidak ditemukan');

	const allProducts = await db.select({ id: products.id, name: products.name, code: products.code }).from(products);

	const formData = {
		code: voucher.code,
		discountType: voucher.discountType,
		discountValue: voucher.discountValue,
		minPurchase: voucher.minPurchase || 0,
		validFrom: voucher.validFrom || '',
		validUntil: voucher.validUntil || '',
		applyToAll: voucher.productRestrictions.length === 0,
		productIds: voucher.productRestrictions.map(r => r.productId)
	};

	return {
		form: await superValidate(formData, zod4(voucherSchema)),
		products: allProducts,
		voucherId
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const voucherId = Number(params.id);
		const form = await superValidate(request, zod4(voucherSchema));
		if (!form.valid) return fail(400, { form });

		// Cek kode voucher kembar (selain voucher ini sendiri)
		const existing = await db.query.vouchers.findFirst({
			where: and(eq(vouchers.code, form.data.code), ne(vouchers.id, voucherId))
		});
		if (existing) {
			return fail(400, { form, message: 'Kode voucher sudah digunakan.' });
		}

		await db.transaction(async (tx) => {
			await tx.update(vouchers).set({
				code: form.data.code,
				discountType: form.data.discountType,
				discountValue: form.data.discountValue,
				minPurchase: form.data.minPurchase,
				validFrom: form.data.validFrom || null,
				validUntil: form.data.validUntil || null,
			}).where(eq(vouchers.id, voucherId));

			// Reset relasi produk
			await tx.delete(voucherProducts).where(eq(voucherProducts.voucherId, voucherId));

			// Insert relasi baru jika dibatasi ke produk tertentu
			if (!form.data.applyToAll && form.data.productIds.length > 0) {
				const insertData = form.data.productIds.map(pid => ({
					voucherId,
					productId: pid
				}));
				await tx.insert(voucherProducts).values(insertData);
			}
		});

		throw redirect(303, '/admin/voucher');
	}
};
