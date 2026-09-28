import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { vouchers, voucherProducts } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const allVouchers = await db.query.vouchers.findMany({
		orderBy: [desc(vouchers.id)]
	});

	return {
		vouchers: allVouchers
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		
		if (!id) return error(400, 'ID tidak valid');

		await db.transaction(async (tx) => {
			// Hapus relasi di voucher_products terlebih dahulu (cascade manual)
			await tx.delete(voucherProducts).where(eq(voucherProducts.voucherId, id));
			
			// Hapus voucher utama
			await tx.delete(vouchers).where(eq(vouchers.id, id));
		});

		return { success: true };
	}
};
