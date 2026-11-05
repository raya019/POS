import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products, sales, vouchers, voucherProducts } from '$lib/server/db/schema.js';
import { allocateStockFifo } from '$lib/server/fifo.js';
import { calculateDiscountsPerItem } from '$lib/server/voucher';
import { sql, isNull, and, or, eq, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

interface Product {
	id: number;
	code: string;
	name: string;
	brand: string;
	size: string;
	color: string;
	sell_price: number;
	total_stock: number;
}

export const load: PageServerLoad = async () => {
	// Ambil produk yang punya sisa stok > 0
	const activeProducts = await db.execute(sql`
		SELECT p.id, p.code, p.name, p.brand, p.size, p.color, p.sell_price, COALESCE(SUM(se.quantity_remaining), 0) as total_stock
		FROM products p
		LEFT JOIN stock_entries se ON p.id = se.product_id
		GROUP BY p.id, p.code, p.name, p.brand, p.size, p.color, p.sell_price
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
		products: activeProducts as unknown as Product[],
		vouchers: mappedVouchers
	};
};

export const actions: Actions = {
	checkout: async ({ request, locals }) => {
		const formData = await request.formData();
		const cartDataStr = formData.get('cartData') as string;
		const voucherCode = ((formData.get('voucherCode') as string) || '').trim();

		if (!cartDataStr) return fail(400, { error: 'Keranjang belanja kosong.' });

		let rawCartItems: { productId: number; qty: number }[];
		try {
			rawCartItems = JSON.parse(cartDataStr);
		} catch {
			return fail(400, { error: 'Format data keranjang tidak valid.' });
		}

		if (!Array.isArray(rawCartItems) || rawCartItems.length === 0) {
			return fail(400, { error: 'Keranjang belanja kosong.' });
		}

		for (const item of rawCartItems) {
			if (
				!item.productId ||
				typeof item.qty !== 'number' ||
				!Number.isInteger(item.qty) ||
				item.qty <= 0
			) {
				return fail(400, { error: 'Jumlah pembelian produk tidak valid.' });
			}
		}

		// Ambil harga asli produk langsung dari database untuk dihitung ulang di server
		const productIds = [...new Set(rawCartItems.map((i) => i.productId))];
		const dbProducts = await db
			.select()
			.from(products)
			.where(inArray(products.id, productIds));

		const productMap = new Map(dbProducts.map((p) => [p.id, p]));

		const verifiedCartItems: {
			productId: number;
			qty: number;
			unitPrice: number;
			subtotal: number;
		}[] = [];

		for (const item of rawCartItems) {
			const dbProd = productMap.get(item.productId);
			if (!dbProd) {
				return fail(400, { error: 'Salah satu produk di keranjang tidak ditemukan di database.' });
			}
			const unitPrice = dbProd.sellPrice;
			verifiedCartItems.push({
				productId: dbProd.id,
				qty: item.qty,
				unitPrice,
				subtotal: unitPrice * item.qty
			});
		}

		let voucher = null;
		let discounts = new Map<number, number>();

		if (voucherCode) {
			// Cari voucher berdasarkan kode
			const [v] = await db.select().from(vouchers).where(eq(vouchers.code, voucherCode));
			if (!v) {
				return fail(400, { error: 'Kode voucher tidak ditemukan.' });
			}

			// Validasi masa berlaku voucher di server (menggunakan CURRENT_DATE database)
			const [activeVoucher] = await db
				.select()
				.from(vouchers)
				.where(
					and(
						eq(vouchers.id, v.id),
						or(isNull(vouchers.validFrom), sql`${vouchers.validFrom} <= CURRENT_DATE`),
						or(isNull(vouchers.validUntil), sql`${vouchers.validUntil} >= CURRENT_DATE`)
					)
				);

			if (!activeVoucher) {
				return fail(400, { error: 'Voucher tidak berlaku atau sudah kadaluarsa.' });
			}

			voucher = activeVoucher;

			// Cek apakah voucher dibatasi untuk produk tertentu
			const restrictions = await db
				.select({ productId: voucherProducts.productId })
				.from(voucherProducts)
				.where(eq(voucherProducts.voucherId, voucher.id));

			const restrictedIds = new Set(restrictions.map((r) => r.productId));
			const eligibleItems =
				restrictedIds.size === 0
					? verifiedCartItems
					: verifiedCartItems.filter((i) => restrictedIds.has(i.productId));

			// Jika voucher khusus produk tertentu, tetapi tidak ada produk yang cocok di keranjang
			if (restrictedIds.size > 0 && eligibleItems.length === 0) {
				return fail(400, {
					error: `Voucher "${voucher.code}" tidak berlaku untuk produk yang ada di keranjang.`
				});
			}

			// Validasi minimum pembelian terhadap subtotal produk yang memenuhi syarat
			const eligibleSubtotal = eligibleItems.reduce((acc, i) => acc + i.subtotal, 0);
			if (voucher.minPurchase && eligibleSubtotal < voucher.minPurchase) {
				return fail(400, {
					error: `Belum memenuhi syarat minimum pembelian voucher "${voucher.code}" (Min: Rp ${voucher.minPurchase.toLocaleString('id-ID')}).`
				});
			}

			discounts = await calculateDiscountsPerItem(
				voucher,
				verifiedCartItems.map((i) => ({ productId: i.productId, subtotal: i.subtotal }))
			);
		}

		// Generate Transaction Code
		const transactionCode = `TRX-${new Date().toLocaleDateString('en-CA')}-${crypto.randomUUID().slice(0, 6)}`;

		try {
			await db.transaction(async (tx) => {
				for (const item of verifiedCartItems) {
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
							totalPaid: item.subtotal - discAmount,
							cashierId: locals.user!.id
						})
						.returning();

					// FIFO Allocation
					await allocateStockFifo(tx, item.productId, sale.id, item.qty);
				}
			});
		} catch (error: any) {
			// Jika terjadi throw dari allocateStockFifo, transaction otomatis rollback
			return fail(400, {
				error: error.message || 'Gagal memproses checkout (stok tidak cukup atau kendala sistem).'
			});
		}

		redirect(303, `/nota/${transactionCode}`);
	}
};
