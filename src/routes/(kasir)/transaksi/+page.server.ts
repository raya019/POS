import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sales, vouchers, voucherProducts } from '$lib/server/db/schema.js';
import { allocateStockFifo } from '$lib/server/fifo.js';
import { calculateDiscountsPerItem } from '$lib/server/voucher';
import { sql, isNull, gte, lte, and, or, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

interface Product {
	id: number;
	code: string;
	name: string;
	sell_price: number;
	barcode: string;
	total_stock: number;
}

export const load: PageServerLoad = async () => {
	// Ambil produk yang punya sisa stok > 0
	const activeProducts = await db.execute(sql`
		SELECT p.id, p.code, p.name, p.sell_price, p.barcode, COALESCE(SUM(se.quantity_remaining), 0) as total_stock
		FROM products p
		LEFT JOIN stock_entries se ON p.id = se.product_id
		GROUP BY p.id, p.code, p.name, p.sell_price, p.barcode
		HAVING COALESCE(SUM(se.quantity_remaining), 0) > 0
	`);

	// Ambil voucher yang masih aktif
	const activeVouchersResult = await db
		.select()
		.from(vouchers)
		.where(
			and(
				or(isNull(vouchers.validFrom), sql`${vouchers.validFrom} <= CURRENT_DATE`),
				or(isNull(vouchers.validUntil), sql`${vouchers.validUntil} >= CURRENT_DATE`)
			)
		);

	const vpResult = await db.select().from(voucherProducts);
	const mappedVouchers = activeVouchersResult.map((v) => ({
		...v,
		restrictedIds: vpResult.filter((vp) => vp.voucherId === v.id).map((vp) => vp.productId)
	}));

	return {
		products: activeProducts as Product[],
		vouchers: mappedVouchers
	};
};

export const actions: Actions = {
	checkout: async ({ request, locals }) => {
		const formData = await request.formData();
		const cartDataStr = formData.get('cartData') as string;
		const voucherCode = formData.get('voucherCode') as string;

		if (!cartDataStr) return fail(400, { error: 'Keranjang belanja kosong' });

		const cartItems = JSON.parse(cartDataStr) as {
			productId: number;
			qty: number;
			unitPrice: number;
		}[];
		if (!cartItems.length) return fail(400, { error: 'Keranjang belanja kosong' });

		let voucher = null;
		let discounts = new Map<number, number>();

		if (voucherCode) {
			const [v] = await db.select().from(vouchers).where(eq(vouchers.code, voucherCode));
			if (!v) return fail(400, { error: 'Voucher tidak valid atau tidak ditemukan' });

			voucher = v;

			// Validasi Min Purchase
			const totalSubtotal = cartItems.reduce((acc, i) => acc + i.unitPrice * i.qty, 0);
			if (v.minPurchase && totalSubtotal < v.minPurchase) {
				return fail(400, { error: `Minimal pembelian untuk voucher ini adalah ${v.minPurchase}` });
			}

			discounts = await calculateDiscountsPerItem(
				v,
				cartItems.map((i) => ({ productId: i.productId, subtotal: i.unitPrice * i.qty }))
			);
		}

		// Generate Transaction Code
		const transactionCode = `TRX-${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 6)}`;

		try {
			await db.transaction(async (tx) => {
				for (const item of cartItems) {
					const subtotal = item.unitPrice * item.qty;
					const discAmount = discounts.get(item.productId) || 0;

					const [sale] = await tx
						.insert(sales)
						.values({
							transactionCode,
							productId: item.productId,
							quantitySold: item.qty,
							unitPrice: item.unitPrice,
							voucherId: voucher?.id,
							discountAmount: discAmount,
							totalPaid: subtotal - discAmount,
							cashierId: locals.user!.id
						})
						.returning();

					// FIFO Allocation
					await allocateStockFifo(tx, item.productId, sale.id, item.qty);
				}
			});
		} catch (error: any) {
			// Jika terjadi throw dari allocateStockFifo, transaction otomatis rollback
			return fail(500, {
				error: error.message || 'Gagal memproses checkout (stok tidak cukup atau kendala sistem)'
			});
		}

		redirect(303, `/nota/${transactionCode}`);
	}
};
